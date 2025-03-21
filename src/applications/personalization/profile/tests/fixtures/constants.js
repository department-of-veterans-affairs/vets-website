export const Locators = {
  SIGNATURE: {
    GENERAL: `[data-testid="messagingSignature"]`,
    EDIT_BTN: `#edit-messages-signature`,
    CANCEL_BTN: `[data-testid="cancel-edit-button"]`,
    SAVE_BTN: `[data-testid="save-edit-button"]`,
    REMOVE_BTN: `#remove-messages-signature`,
    NAME_LABEL: `#root_signatureName-label`,
    TITLE_LABEL: `#root_signatureTitle-label`,
    NAME_FIELD: `#root_signatureName`,
    TITLE_FIELD: `#root_signatureTitle`,
    ALERTS: {
      SUCCESS: `#messagingSignature-alert`,
      FIELD_ERROR: '[role="alert"]',
      CROSS_BTN: `.first-focusable-child`,
      CONFIRM_CANCEL_MODAL: `[data-testid="confirm-cancel-modal"]`,
      REMOVE_TITLE: `#heading`,
      REMOVE_TEXT: `[modal-title="Remove signature?"] > p`,
      CONFIRM_REMOVE_BTN: `[modal-title="Remove signature?"] > div > button`,
      CANCEL_REMOVE_BTN: `[modal-title="Remove signature?"] > div > va-button`,
    },
  },
};

export const Data = {
  SIGNATURE: {
    UPDATE_SAVED: `Update saved.`,
    CHOOSE_EDIT: `Choose edit to add a messages signature.`,
    ALERTS: {
      EMPTY_FIELD: `Error Both fields are required to save a signature.`,
      CANCEL_CHANGES: `Cancel changes?`,
      CANCEL_ALERT: `You haven't finished editing and saving the changes to your messages signature. If you cancel now, we won't save your changes.`,
      CANCEL_BTN: `Yes, cancel my changes`,
      BACK_TO_EDIT_BTN: `No, go back to editing`,
      REQUIRED: `(*Required)`,
      REMOVE: `Remove signature?`,
      REMOVE_TEXT: `Your signature will no longer appear on outgoing secure messages.You can always come back to your profile later if you want to add this signature again.`,
      REMOVE_BTN: `Yes, remove my signature`,
      CANCEL_REMOVE_BTN: `No, cancel this change`,
    },
  },
};

export const Paths = {
  INTERCEPT: {
    SIGNATURE: `/my_health/v1/messaging/preferences/signature`,
  },
};
