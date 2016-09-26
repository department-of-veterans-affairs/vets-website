import React from 'react';

import { isBlank } from '../../common/utils/validations';
import { createNewFolder } from '../config';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import Modal from '../../common/components/Modal';

class ModalCreateFolder extends React.Component {
  constructor(props) {
    super(props);
    this.validateFolderName = this.validateFolderName.bind(this);
  }

  validateFolderName(folderName, dirty = false) {
    const err = {};
    const existingFolders = this.props.folders;
    const trimmedFolderName = folderName.trim();

    if (dirty === false) {
      return false;
    }

    if (isBlank(trimmedFolderName)) {
      err.hasError = true;
      err.type = 'empty';
    }
    // Disallows anything other than a-z, 0-9, and space
    // (case insensitive)
    const allowedRegExp = /[^a-z0-9\s]/ig;
    if (allowedRegExp.test(trimmedFolderName)) {
      err.hasError = true;
      err.type = 'patternMismatch';
    }

    const doesFolderExist = (folder) => { return trimmedFolderName === folder.name; };

    if (!!existingFolders.find(doesFolderExist)) {
      err.hasError = true;
      err.type = 'exists';
    }

    return err;
  }

  render() {
    const error = this.validateFolderName(this.props.newFolderName.value, this.props.newFolderName.dirty);

    const modalContents = (
      <form onSubmit={this.props.onSubmit}>
        <h3 className="messaging-modal-title">
          Create new folder
        </h3>
        <ErrorableTextInput
            errorMessage={error.hasError ? createNewFolder.errorMessages[error.type] : undefined}
            label="Please enter a new folder name:"
            onValueChange={this.props.onValueChange}
            name="newFolderName"
            charMax={createNewFolder.maxLength}
            field={this.props.newFolderName}/>

        <div className="va-modal-button-group">
          <button
              disabled={error.hasError}
              type="submit">Create</button>
          <button
              className="usa-button-outline"
              onClick={this.props.onClose}
              type="button">Cancel</button>
        </div>
      </form>
    );

    return (
      <Modal
          cssClass={this.props.cssClass}
          contents={modalContents}
          id={this.props.id}
          onClose={this.props.onClose}
          visible={this.props.visible}/>
    );
  }
}

ModalCreateFolder.propTypes = {
  errorMessage: React.PropTypes.string,
  cssClass: React.PropTypes.string,
  folders: React.PropTypes.array,
  newFolderName: React.PropTypes.object,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func,
  onValueChange: React.PropTypes.func,
  visible: React.PropTypes.bool.isRequired
};

export default ModalCreateFolder;
