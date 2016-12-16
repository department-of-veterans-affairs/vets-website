import React from 'react';

import Modal from '../../../common/components/Modal';

class ModalConfirmSave extends React.Component {
  constructor(props) {
    super(props);
    this.saveDraft = this.saveDraft.bind(this);
  }

  saveDraft(event) {
    event.preventDefault();
    this.props.onSave();
  }

  render() {
    const modalContents = (
      <form onSubmit={this.saveDraft}>
        <h3>
          Save without attachments
        </h3>
        <p>
          Drafts cannot be saved with attachments.
          You'll have to reattach attachments when
          you're ready to send your message.
          Would you like to save your message anyway?
        </p>
        <div className="va-modal-button-group">
          <button type="submit">Save as draft</button>
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

ModalConfirmSave.propTypes = {
  cssClass: React.PropTypes.string,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired
};

export default ModalConfirmSave;
