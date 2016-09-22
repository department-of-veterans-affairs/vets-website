import React from 'react';

import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import Modal from '../../common/components/Modal';
import { makeField } from '../../common/model/fields';

class ModalCreateFolder extends React.Component {
  render() {
    const folderName = makeField(undefined);
    const modalContents = (
      <form onSubmit={(e) => {e.preventDefault();}}>
        <h3 className="messaging-modal-title">
          Create new folder
        </h3>
        <ErrorableTextInput
            errorMessage=""
            label="Please enter a new folder name:"
            onValueChange={() => {}}
            name="folderName"
            field={folderName}/>

        <div className="va-modal-button-group">
          <button type="submit">Create</button>
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
  id: React.PropTypes.string,
  onClose: React.PropTypes.func,
  onValueChange: React.PropTypes.func,
  visible: React.PropTypes.bool.isRequired
};

export default ModalCreateFolder;
