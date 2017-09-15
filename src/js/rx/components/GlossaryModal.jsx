import PropTypes from 'prop-types';
import React from 'react';
// import { Link } from 'react-router';
import { glossary } from '../config.js';
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

    let key = 0;
    const sections = Object.keys(glossary).map((sect) => {
      return (<GlossaryList
        key={key++}
        title={`${sect} statuses`}
        terms={glossary[sect]}/>);
    });

    let element;
    if (this.props.isVisible) {
      element = (
        <div>
          {this.props.content}
          {sections}
          <div className="va-modal-button-group cf">
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </div>
        </div>
      );
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
