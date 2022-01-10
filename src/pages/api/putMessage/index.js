const mq = require("ibmmq");
const MQC = mq.MQC;

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { queue, message, properties } = req.body;
      const queueManager = process.env.QUEUE_MANAGER;

      const msgId = sendMessage(queueManager, queue, message, properties);
      res.status(200).json({ msgId });
    } catch (error) {
      const errorMessage = error.message;
      res.status(400).send(errorMessage);
    }
  } else {
    res.status(405);
    res.end("Method not allowed");
  }
}

function sendMessage(qMgr, qName, messsage, properties) {
  const connectionOptions = new mq.MQCNO();
  let msgId;

  mq.ConnxSync(qMgr, connectionOptions, function (err, conn) {
    if (err) {
      throw new Error(formatErr(err));
    }

    console.log("Connection to %s successful ", qMgr);

    // Define what we want to open, and how we want to open it.
    const objectDescriptor = new mq.MQOD();
    const openOptions = MQC.MQOO_OUTPUT;
    objectDescriptor.ObjectName = qName;
    objectDescriptor.ObjectType = MQC.MQOT_Q;

    mq.OpenSync(conn, objectDescriptor, openOptions, function (err, hObj) {
      if (err) {
        cleanup(conn, hObj);
        throw new Error(formatErr(err));
      } else {
        console.log("Open of %s successful", qName);
        msgId = putMessage(messsage, conn, hObj, properties);
      }
      cleanup(conn, hObj);
    });
  });
  return msgId;
}

function putMessage(message, hConn, hObj, properties) {
  const mqmd = new mq.MQMD();
  const pmo = new mq.MQPMO();
  const cmho = new mq.MQCMHO();
  let msgId;

  mq.CrtMh(hConn, cmho, function (err, mh) {
    if (err) {
      throw new Error(formatErr(err));
    } else {
      const smpo = new mq.MQSMPO();
      const pd = new mq.MQPD();

      properties.forEach((property) => {
        mq.SetMp(hConn, mh, smpo, property.name, pd, property.value);
      });
    }

    // Describe how the Put should behave and put the message
    pmo.Options =
      MQC.MQPMO_NO_SYNCPOINT | MQC.MQPMO_NEW_MSG_ID | MQC.MQPMO_NEW_CORREL_ID;

    // Make sure the message handle is used during the Put
    pmo.OriginalMsgHandle = mh;

    mq.PutSync(hObj, mqmd, pmo, message, function (err) {
      // Delete the message handle after the put has completed
      const dmho = new mq.MQDMHO();
      mq.DltMh(hConn, mh, dmho, function (err) {
        if (err) {
          throw new Error(formatErr(err));
        } else {
          console.log("MQDLTMH successful");
        }
      });

      if (err) {
        throw new Error(formatErr(err));
      } else {
        msgId = toHexString(mqmd.MsgId);
        console.log("msgId: " + toHexString(mqmd.MsgId));
        console.log("MQPUT successful");
      }
    });
  });
  return msgId;
}

// When we're done, close queues and connections
function cleanup(hConn, hObj) {
  mq.Close(hObj, 0, function (err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function (err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

function formatErr(err) {
  return "MQ call failed in " + err.message;
}

function toHexString(byteArray) {
  return byteArray.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    ""
  );
}
