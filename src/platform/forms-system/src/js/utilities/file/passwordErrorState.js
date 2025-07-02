/**
 * Use this module in a validation function for file input web component
 * pattern to check if the password for an encrypted file should throw an error
 */
class PasswordErrorState {
  _hasPassword = false;

  _needsPassword = false;

  _touched = false;

  setHasPassword(state) {
    this._hasPassword = state;
  }

  setNeedsPassword(state) {
    this._needsPassword = state;
  }

  setTouched(state) {
    this._touched = state;
  }

  touched() {
    return this._touched;
  }

  hasPasswordError() {
    return this._needsPassword && !this._hasPassword;
  }

  reset() {
    this.setHasPassword(false);
    this.setNeedsPassword(false);
    this.setTouched(false);
  }
}

// a page might have more than one file input so let each maintain its own password error state
const errorStates = {
  instances: {},

  getInstance(id) {
    if (!(id in this.instances)) {
      this.instances[id] = new PasswordErrorState();
    }
    return this.instances[id];
  },

  reset() {
    this.instances = {};
  },
};

export default errorStates;
