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

  getNeedsPassword() {
    return this._needsPassword;
  }

  getHasPassword() {
    return this._hasPassword;
  }

  hasPasswordError() {
    return this._needsPassword && !this._hasPassword;
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
  fileCheckErrors: [],
  internalFileInputErrors: [],
  touched: null,

  setTouched(value = this.passwordInstances.length) {
    this.touched = value;
  },

  setInternalFileInputErrors(index, value) {
    this.internalFileInputErrors[index] = value;
  },

  removeInternalFileInputError(index) {
    this.internalFileInputErrors.splice(index, 1);
  },

  getInternalFileInputErrors() {
    return this.internalFileInputErrors;
  },

  setFileCheckError(index, value) {
    this.fileCheckErrors[index] = value;
  },

  removeFileCheckError(index) {
    this.fileCheckErrors.splice(index, 1);
  },

  getFileCheckErrors() {
    return this.fileCheckErrors;
  },

  addPasswordInstance(index, needsPassword = false) {
    const instance = needsPassword ? new PasswordErrorState() : null;
    if (instance) instance.setNeedsPassword(true);
    this.passwordInstances[index] = instance;
  },

  setHasPassword(index, state) {
    if (this.passwordInstances.length >= index) {
      this.passwordInstances[index].setHasPassword(state);
    }
  },

  resetInstance(index) {
    if (this.passwordInstances.length >= index) {
      this.passwordInstances[index].setHasPassword(true);
    }
  },

  removeInstance(index) {
    this.passwordInstances.splice(index, 1);
    if (typeof this.touched === 'number') {
      this.setTouched();
    }
  },

  addAdditionalInputErrors(error) {
    this.additionalInputErrors.push(error);
  },

  removeAdditionalInputErrors(index) {
    this.additionalInputErrors.splice(index, 1);
    // decrement last touched count
    const _touched =
      typeof this.touched === 'number' && this.touched > 0
        ? this.touched - 1
        : null;
    this.setTouched(_touched);
  },

  getAdditionalInputErrors() {
    return this.additionalInputErrors;
  },

  getPasswordInstances() {
    return this.passwordInstances;
  },

  getLastTouched() {
    return this.touched;
  },
};

export default errorStates;
