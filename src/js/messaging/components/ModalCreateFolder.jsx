import React from 'react';

import { createNewFolderSettings } from '../config';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import Modal from '../../common/components/Modal';

class ModalCreateFolder extends React.Component {
  render() {
    const modalContents = (
      <form onSubmit={this.props.onSubmit}>
        <h3 className="messaging-modal-title">
          Create new folder
        </h3>
        <ErrorableTextInput
            errorMessage={this.props.errorMessage}
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
