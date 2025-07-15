/**
 * Use this module in a validation function to determine if validation
 * was triggered by user attempting to navigate form page
 */
const passwordErrorState = {
  _hasPassword: false,
  _needsPassword: false,
  _touched: false,
  _hasAdditionalInfo: false,

  setHasPassword(state) {
    this._hasPassword = state;
  },

  setNeedsPassword(state) {
    this._needsPassword = state;
  },

  setTouched(state) {
    this._touched = state;
  },

  touched() {
    return this._touched;
  },

  setHasAdditionalInfo(state) {
    this._hasAdditionalInfo = state;
  },

  hasPasswordError() {
    return this._needsPassword && !this._hasPassword;
  },

  hasAdditionInfo() {
    return this._hasAdditionalInfo;
  },

  reset() {
    this.setHasAdditionalInfo(false);
    this.setHasPassword(false);
    this.setNeedsPassword(false);
  },
};

export default passwordErrorState;
