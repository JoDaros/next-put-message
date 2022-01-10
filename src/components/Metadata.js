import React, { useEffect, useState } from "react";
import { Alert, Dropdown, DropdownButton, Form, Stack } from "react-bootstrap";

// eslint-disable-next-line react/display-name
const Metadata = React.forwardRef((props, ref) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch("/api/metadata/listAllTemplates")
      .then((response) => response.json())
      .then((templates) => setTemplates(templates));
  }, []);

  const clearHandler = () => {
    ref.current.value = "";
  };
  const loadTemplateHandler = (templateName) => {
    fetch(`/api/metadata/load/${templateName}`)
      .then((response) => response.json())
      .then((data) => {
        ref.current.value = data.contents;
      });
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="metadata">Metadata</Form.Label>
      <Form.Control
        id="metadata"
        as="textarea"
        style={{ height: "150px" }}
        ref={ref}
      />

      {props.error && <Alert variant="danger">{props.error}</Alert>}

      <Stack direction="horizontal" gap={3}>
        <DropdownButton
          id="dropdown-basic-button"
          title="Reset"
          className="ms-auto mt-1"
          variant="secondary"
        >
          <Dropdown.Item onClick={clearHandler}>Clear</Dropdown.Item>
          {templates.map((template) => (
            <Dropdown.Item
              key={template}
              onClick={loadTemplateHandler.bind(null, template)}
            >
              {template}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Stack>
    </Form.Group>
  );
});
export default Metadata;
