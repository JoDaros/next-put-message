import React from "react";
import format from "xml-formatter";
import { Alert, Button, Form, Stack } from "react-bootstrap";

// eslint-disable-next-line react/display-name
const Message = React.forwardRef((props, ref) => {
  const onPrettyPrint = () => {
    try {
      props.onErrorClear();
      ref.current.value = format(ref.current.value, {
        indentation: "\t",
        collapseContent: true,
      });
    } catch (err) {
      props.onError(err.message);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="message">Message</Form.Label>
      <Form.Control
        id="message"
        as="textarea"
        style={{ height: "350px" }}
        ref={ref}
      />
      {props.error && <Alert variant="danger mt-2">{props.error}</Alert>}
      <Stack direction="horizontal" gap={3}>
        <Button
          variant="secondary"
          className="ms-auto mt-1"
          onClick={onPrettyPrint}
        >
          Pretty Print XML
        </Button>
      </Stack>
    </Form.Group>
  );
});
export default Message;
