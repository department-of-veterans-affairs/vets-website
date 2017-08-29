import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Modal from '../../common/components/Modal';
import GlossaryList from './GlossaryList';

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
    let element;
    if (this.props.isVisible) {
      element = (
        <div>
          <GlossaryList terms={this.props.content}/>
          <div className="va-modal-button-group cf">
            <button type="button" onClick={this.handleCloseModal}>Close</button>
            <Link
              to="/glossary"
              onClick={this.props.onCloseModal}>
              See all status definitions
            </Link>
          </div>
        </div>
      );
    } else {
      element = (<div/>);
    }

    return (
      <Modal
        cssClass="va-modal rx-modal"
        contents={element}
        hideCloseButton
        id="rx-glossary-modal"
        onClose={this.handleCloseModal}
        title="Glossary"
        visible={this.props.isVisible}/>
    );
  }
}

GlossaryModal.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    definition: PropTypes.string
  })),
  onCloseModal: PropTypes.func
};

export default GlossaryModal;
