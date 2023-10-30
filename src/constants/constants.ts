const CONSTANTS = {
  STATUS: {
    UPLOADED: "Uploaded",
    EDITING: "Editing",
    EDITED: "Edited",
    SAVED_AS_DRAFT: "Saved As Draft",
    TRANSCODED: "Transcoded",
    IN_PROGRESS: "In Progress",
    FAILED: "Failed",
    PUBLISHED: "Published",
    COMPLETED: "Completed",
  },
  TRANSCODING_STATUS: [
    { id: "1", label: "All", value: "" },
    { id: "2", label: "Uploaded", value: "Uploaded" },
    { id: "3", label: "Edited", value: "Edited" },
    { id: "4", label: "Saved As Draft", value: "Saved As Draft" },
    { id: "5", label: "Transcoded", value: "Transcoded" },
    { id: "6", label: "In Progress", value: "In Progress" },
    { id: "7", label: "Failed", value: "Failed" },
    { id: "8", label: "Published", value: "Published" },
  ],
  PUSH_STATUS: [
    { id: "1", label: "All", value: "" },
    { id: "2", label: "Published", value: "Published" },
    { id: "3", label: "Unpublished", value: "Unpublished" },
  ],
  ACTION: {
    VIEW: "view",
    EDIT: "edit",
    DELETE: "delete",
    ADD: "add",
    CLONE: "clone",
  },
  FILTER_BY: {
    SEARCH_TEXT: "search_text",
    DATE_RANGE: "date_range",
  },

  UPLOAD_METHOD: {
    FROM_COMPUTER: "fromComputer",
    FROM_S3_UPLOAD: "fromS3Upload",
    CHOOSE_FROM_LAST_RECORD: "chooseFromLastRecord",
  },

  DATE_FORMAT: "dd/MM/yyyy",
  DATE_PLACEHOLDER: "DD/MM/YYYY",
};

export default CONSTANTS;
