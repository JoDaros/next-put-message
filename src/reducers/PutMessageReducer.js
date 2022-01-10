export function putMessageReducer(state, action) {
  switch (action.type) {
    case "error":
      return {
        queueError: "",
        metadataError: "",
        messageError: "",
        error: action.payload,
        success: "",
        loading: false,
      };
    case "success":
      return {
        queueError: "",
        metadataError: "",
        messageError: "",
        error: "",
        success: action.payload,
        loading: false,
      };
    case "queueError":
      return { ...state, queueError: action.payload };
    case "metadataError":
      return { ...state, metadataError: action.payload };
    case "messageError":
      return { ...state, messageError: action.payload };
    case "clearQueueError":
      return { ...state, queueError: "" };
    case "clearMetadataError":
      return { ...state, metadataError: "" };
    case "clearMessageError":
      return { ...state, messageError: "" };
    case "clearSuccess":
      return { ...state, success: "" };
    case "loading":
      return {
        queueError: "",
        metadataError: "",
        messageError: "",
        error: "",
        success: "",
        loading: true,
      };
    default:
      throw new Error("Action not supported");
  }
}
