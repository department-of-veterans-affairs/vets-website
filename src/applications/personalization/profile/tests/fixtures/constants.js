export const Locators = {
  SIGNATURE: {
    GENERAL: `[data-testid="messagingSignature"]`,
    EDIT_BTN: `#edit-messages-signature`,
    CANCEL_BTN: `[data-testid="cancel-edit-button"]`,
    SAVE_BTN: `[data-testid="save-edit-button"]`,
    NAME_LABEL: `#root_signatureName-label`,
    TITLE_LABEL: `#root_signatureTitle-label`,
    NAME_FIELD: `#root_signatureName`,
    TITLE_FIELD: `#root_signatureTitle`,
    ALERTS: {
      SUCCESS: `#messagingSignature-alert`,
      FIELD_ERROR: '[role="alert"]',
      CROSS_BTN: `.first-focusable-child`,
      CONFIRM_CANCEL_MODAL: `[data-testid="confirm-cancel-modal"]`,
    },
  },
};

export const Data = {
  SIGNATURE: {
    UPDATE_SAVED: `Update saved.`,
    ALERTS: {
      EMPTY_FIELD: `Error Both fields are required to save a signature.`,
      CANCEL_CHANGES: `Cancel changes?`,
      CANCEL_ALERT: `You haven't finished editing and saving the changes to your messages signature. If you cancel now, we won't save your changes.`,
      CANCEL_BTN: `Yes, cancel my changes`,
      BACK_TO_EDIT_BTN: `No, go back to editing`,
      REQUIRED: `(*Required)`,
    },
  },
};

export const Paths = {
  INTERCEPT: {
    SIGNATURE: `/my_health/v1/messaging/preferences/signature`,
  },
};
