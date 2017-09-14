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
          <button className="va-modal-close" type="button"><i className="fa fa-close"></i><span className="usa-sr-only" onClick={this.props.handleCloseModal}>Close this modal</span></button>
          <GlossaryList terms={this.props.content}/>
          <div>
          console.log(What does this data look like? {this.props.content} , <GlossaryList/>);
          </div>
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
        cssClass="va-modal"
        contents={element}
        hideCloseButton
        id="rx-glossary-modal"
        title="Glossary"
        onClose={this.handleCloseModal}
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
