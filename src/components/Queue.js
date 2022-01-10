import React, { Fragment } from "react";
import { Alert } from "react-bootstrap";

// eslint-disable-next-line react/display-name
const Queue = React.forwardRef((props, ref) => {
  return (
    <div className="form-group">
      <label htmlFor="queueName" className="form-label">
        Queue
      </label>
      <input
        type="text"
        className="form-control mb-2"
        id="queueName"
        ref={ref}
      />
      {props.error && <Alert variant="danger">{props.error}</Alert>}
    </div>
  );
});

export default Queue;
