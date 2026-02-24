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
      CROSS_BTN: `.va-modal-close`,
      CONFIRM_CANCEL_MODAL: `[data-testid="confirm-cancel-modal"]`,
      REMOVE_TITLE: `#heading`,
      MODAL: `va-modal[data-testid="confirm-remove-modal"]`,
      REMOVE_TEXT: `[modal-title="Remove your messages signature?"] > p`,
    },
  },
};

export const Data = {
  SIGNATURE: {
    UPDATE_SAVED: `Update saved`,
    CHOOSE_EDIT: `Choose edit to add a messages signature.`,
    ALERTS: {
      EMPTY_FIELD: `Error Both fields are required to save a signature.`,
      CANCEL_CHANGES: `Cancel changes?`,
      CANCEL_ALERT: `You haven't saved the changes you made to your messages signature. If you cancel, we won't save your changes.`,
      CANCEL_BTN: `Cancel changes`,
      BACK_TO_EDIT_BTN: `Keep editing`,
      REQUIRED: `(*Required)`,
      REMOVE: `Remove your messages signature?`,
      REMOVE_TEXT: `This will remove your signature on outgoing messages.You can always add another messages signature any time.`,
      REMOVE_BTN: `Remove`,
      CANCEL_REMOVE_BTN: `Cancel change`,
    },
  },
};

export const Paths = {
  INTERCEPT: {
    SIGNATURE: `/my_health/v1/messaging/preferences/signature`,
  },
};
