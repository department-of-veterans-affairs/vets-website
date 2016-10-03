import React from 'react';

import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import Modal from '../../common/components/Modal';
import { makeField } from '../../common/model/fields';
import { validateIfDirty, isNotBlank } from '../../common/utils/validations';
import { createNewFolderSettings } from '../config';

class ModalCreateFolder extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.validateFolderName = this.validateFolderName.bind(this);
  }

  handleValueChange(field) {
    this.props.onValueChange(makeField(field.value, true));
  }

  handleSubmit(domEvent) {
    domEvent.preventDefault();
    const newFolderName = this.props.newFolderName;

    // Mark the field dirty upon submit to trigger validation
    // that only works on dirty fields.
    if (!newFolderName.dirty) {
      this.handleValueChange(newFolderName);
    } else {
      this.props.onSubmit(newFolderName.value);
    }
  }

  validateFolderName(folderName, existingFolders = []) {
    const err = {};
    // TODO: Refactor isNotBlank validator to trim input.
    const trimmedFolderName = makeField(folderName.value.trim(), folderName.dirty);

    if (!validateIfDirty(trimmedFolderName, isNotBlank)) {
      err.hasError = true;
      err.type = 'empty';
    }

    // Disallows anything other than a-z, 0-9, and space
    // (case insensitive)
    const allowedRegExp = /[^a-z0-9\s]/ig;
    if (allowedRegExp.test(trimmedFolderName.value)) {
      err.hasError = true;
      err.type = 'patternMismatch';
    }

    const doesFolderExist = (folder) => {
      return trimmedFolderName.value.toLowerCase() === folder.name.toLowerCase();
    };

    if (!!existingFolders.find(doesFolderExist)) {
      err.hasError = true;
      err.type = 'exists';
    }

    return err;
  }

  render() {
    const foldersWeHave = this.props.folders;
    const newFolderName = this.props.newFolderName;
    const error = this.validateFolderName(newFolderName, foldersWeHave);

    const modalContents = (
      <form onSubmit={this.handleSubmit}>
        <h3 className="messaging-modal-title">
          Create new folder
        </h3>
        <ErrorableTextInput
            errorMessage={error.hasError ? createNewFolderSettings.errorMessages[error.type] : undefined}
            label="Please enter a new folder name:"
            onValueChange={this.handleValueChange}
            name="newFolderName"
            charMax={createNewFolderSettings.maxLength}
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
  onSubmit: React.PropTypes.func,
  onValueChange: React.PropTypes.func,
  visible: React.PropTypes.bool.isRequired
};

export default ModalCreateFolder;
