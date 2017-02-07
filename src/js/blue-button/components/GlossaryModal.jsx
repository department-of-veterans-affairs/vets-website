import React from 'react';
import Modal from '../../common/components/Modal';

class GlossaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    if (this.props.isVisible) {
      return (
        <Modal
            cssClass="bb-modal"
            contents={this.props.content}
            id="bb-glossary-modal"
            onClose={this.handleCloseModal}
            title={this.props.title}
            visible={this.props.isVisible}/>
        );
    }
    return null;
  }
}

GlossaryModal.propTypes = {
  content: React.PropTypes.string,
  title: React.PropTypes.string,
  onCloseModal: React.PropTypes.func
};

export default GlossaryModal;
