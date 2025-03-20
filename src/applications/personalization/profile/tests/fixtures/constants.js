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
    ALERT: `#messagingSignature-alert`,
  },
};

export const Data = {
  SIGNATURE: {
    UPDATE_SAVED: `Update saved.`,
  },
};

export const Paths = {
  INTERCEPT: {
    SIGNATURE: `/my_health/v1/messaging/preferences/signature`,
  },
};
