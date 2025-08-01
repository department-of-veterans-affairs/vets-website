/**
 * Use this module in a validation function for file input web component
 * pattern to check if the password for an encrypted file should throw an error
 */
class PasswordErrorState {
  _hasPassword = false;

  _needsPassword = false;

  _touched = false;

  _additionalInputErrors = {};

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
    return this._needsPassword && !this._hasPassword && this._touched;
  }

  reset() {
    this.setHasPassword(false);
    this.setNeedsPassword(false);
    this.setTouched(false);
    this._additionalInputErrors = {};
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

// for use with VaFileInputMultiple
export const errorManager = {
  passwordInstances: [],
  additionalInputErrors: [],

  addPasswordInstance(needsPassword = false) {
    let instance = null;
    if (needsPassword) {
      instance = new PasswordErrorState();
      instance.setNeedsPassword(true);
    }
    const instances = [...this.passwordInstances, instance];
    this.passwordInstances = instances;
  },

  setHasPassword(index, state) {
    if (this.passwordInstances.length >= index) {
      this.passwordInstances[index].setHasPassword(state);
    }
  },

  removePasswordInstance(index) {
    this.passwordInstances = [...this.passwordInstances].toSpliced(index, 1);
  },

  addAdditionalInputErrors(error) {
    this.addAdditionalInputErrors.push(error);
  },

  removeAdditionalInputErrors(index) {
    this.addAdditionalInputErrors = [
      ...this.addAdditionalInputErrors,
    ].toSpliced(index, 1);
  },

  getAdditionalInputErrors() {
    return this.addAdditionalInputErrors;
  },

  getPasswordInstances() {
    return this.passwordInstances;
  },
};

export default errorStates;
