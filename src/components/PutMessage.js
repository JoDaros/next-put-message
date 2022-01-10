import Queue from "./Queue";
import Metadata from "./Metadata";
import Message from "./Message";
import React, { useCallback, useReducer, useRef } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { putMessageReducer } from "../reducers/PutMessageReducer";

const initialState = {
  queueError: "",
  metadataError: "",
  messageError: "",
  error: "",
  success: "",
  loading: false,
};

const PutMessage = () => {
  const [state, dispatch] = useReducer(putMessageReducer, initialState);

  const queueRef = useRef();
  const metadataContentRef = useRef();
  const messageRef = useRef();

  const sendMessageToMQ = useCallback(async (queue, message, properties) => {
    const messageObj = { queue, message, properties };
    dispatch({ type: "loading" });
    try {
      const response = await fetch("/api/putMessage", {
        method: "POST",
        body: JSON.stringify(messageObj),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.text();
        if (error) {
          dispatch({ type: "error", payload: error });
        } else {
          dispatch({
            type: "error",
            payload: "Something went wrong while connection to MQ",
          });
        }
        return;
      }
      const data = await response.json();
      dispatch({
        type: "success",
        payload: "Created message with MsgId: " + data.msgId,
      });
    } catch {
      dispatch({
        type: "error",
        payload: "Something went wrong while connection to MQ",
      });
    }
  }, []);

  const sendPropertiesToAPI = useCallback(async (propertiesTxt) => {
    const response = await fetch("/api/properties", {
      method: "POST",
      body: propertiesTxt,
      headers: {
        "Content-Type": "text/html",
      },
    });
    return await response.json();
  }, []);

  const convertMetadata = useCallback(async (metadataText) => {
    return await sendPropertiesToAPI(metadataText);
  }, []);

  const validateQueue = useCallback((queue) => {
    if (!queue || queue.trim() === "") {
      dispatch({
        type: "queueError",
        payload: "Queue is mandatory",
      });
      return true;
    } else {
      dispatch({ type: "clearQueueError" });
      return false;
    }
  }, []);

  const validateMetadata = useCallback((metadataText) => {
    if (metadataText && metadataText.trim() !== "" && !metadata) {
      dispatch({
        type: "metadataError",
        payload: "Invalid Metadata format!",
      });
      return true;
    } else {
      dispatch({ type: "clearMetadataError" });
      return false;
    }
  }, []);

  const mapMetadataToProperties = useCallback((metadata) => {
    const properties = [];
    if (metadata) {
      for (let prop in metadata) {
        properties.push({ name: prop, value: metadata[prop] });
      }
    }
    return properties;
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();

    const queue = queueRef.current.value;
    const metadataText = metadataContentRef.current.value;
    const message = messageRef.current.value;

    let metadata = await convertMetadata(metadataText);

    let invalid = validateQueue(queue) || validateMetadata(metadataText);

    if (invalid) {
      return;
    }

    const properties = mapMetadataToProperties(metadata);

    sendMessageToMQ(queue, message, properties);
  };

  const onMessageErrorHandler = useCallback((message) => {
    dispatch({
      type: "messageError",
      payload: message,
    });
  }, []);

  const onMessageClearErrorHandler = useCallback(() => {
    dispatch({ type: "clearMessageError" });
  }, []);

  const onCloseSuccessAlertHandler = useCallback(() => {
    dispatch({ type: "clearSuccess" });
  }, []);

  let buttonContent;

  if (state.loading) {
    buttonContent = (
      <Button variant="primary" size="lg" disabled>
        Sending...
        <Spinner
          as="span"
          variant="light"
          size="sm"
          role="status"
          aria-hidden="true"
          animation="border"
        />
      </Button>
    );
  } else {
    buttonContent = (
      <Button variant="primary" type="submit" size="lg">
        Put Message
      </Button>
    );
  }

  return (
    <form className="container-fluid" onSubmit={submitHandler}>
      <Queue ref={queueRef} error={state.queueError} />
      <Metadata ref={metadataContentRef} error={state.metadataError} />
      <Message
        ref={messageRef}
        error={state.messageError}
        onError={onMessageErrorHandler}
        onErrorClear={onMessageClearErrorHandler}
      />
      {buttonContent}
      {state.error && <Alert variant="danger mt-2">{state.error}</Alert>}
      {state.success && (
        <Alert
          variant="success mt-2"
          dismissible
          onClose={onCloseSuccessAlertHandler}
        >
          <small>{new Date().toJSON()}</small>
          <p>{state.success}</p>
        </Alert>
      )}
    </form>
  );
};
export default PutMessage;
