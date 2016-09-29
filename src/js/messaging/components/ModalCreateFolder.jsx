import React from 'react';

import { createNewFolderSettings } from '../config';
import { isBlank } from '../../common/utils/validations';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import Modal from '../../common/components/Modal';

class ModalCreateFolder extends React.Component {
  constructor(props) {
    super(props);
    this.validateFolderName = this.validateFolderName.bind(this);
  }

  validateFolderName(folderName, dirty = false, existingFolders = []) {
    const err = {};
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

    const doesFolderExist = (folder) => {
      return trimmedFolderName.toLowerCase() === folder.name.toLowerCase();
    };

    if (!!existingFolders.find(doesFolderExist)) {
      err.hasError = true;
      err.type = 'exists';
    }

    return err;
  }

  render() {
    const foldersWeHave = this.props.folders;
    const formValue = this.props.newFolderName.value;
    const isFieldDirty = this.props.newFolderName.dirty;

    const error = this.validateFolderName(formValue, isFieldDirty, foldersWeHave);

    const modalContents = (
      <form onSubmit={this.props.onSubmit}>
        <h3 className="messaging-modal-title">
          Create new folder
        </h3>
        <ErrorableTextInput
            errorMessage={error.hasError ? createNewFolderSettings.errorMessages[error.type] : undefined}
            label="Please enter a new folder name:"
            onValueChange={this.props.onValueChange}
            name="newFolderName"
            charMax={createNewFolderSettings.maxLength}
            field={this.props.newFolderName}/>

        <div className="va-modal-button-group">
          <button
              disabled={!!this.props.errorMessage}
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
