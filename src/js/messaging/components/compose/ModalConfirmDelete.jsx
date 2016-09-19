import React from 'react';

import Modal from '../../../common/components/Modal';

class ModalConfirmDelete extends React.Component {
  render() {
    const modalcontents = (
      <form onSubmit={this.props.onDelete}>
        <h3 className="messaging-modal-title">
            Are you sure you want to delete this draft?
        </h3>
        <p>This draft will not be recoverable after deletion.</p>
        <div className="va-modal-button-group">
          <button type="submit">Yes, delete forever</button>
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
          contents={modalcontents}
          id={this.props.id}
          onClose={this.props.onClose}
          visible={this.props.visible}/>
    );
  }
}

ModalConfirmDelete.propTypes = {
  cssClass: React.PropTypes.string,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired
};

export default ModalConfirmDelete;
