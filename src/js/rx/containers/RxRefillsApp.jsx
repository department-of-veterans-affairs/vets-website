import React from 'react';
import { connect } from 'react-redux';

import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

import { openAlert } from '../actions/alert.js';
import { openModal, closeModal } from '../actions/modal.js';

class RxRefillsApp extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <ConfirmRefillModal
            isVisible={this.props.modal.visible}
            drug="Acetaminophen"
            dosage="250mg"
            lastRefilled="06/07/2016"
            openAlert={this.props.openAlert}
            onCloseModal={this.props.closeModal}/>
        <GlossaryModal
            content={this.props.modal.content}
            isVisible={this.props.modal.visible}
            onCloseModal={this.props.closeModal}/>
      </div>
    );
  }
}

RxRefillsApp.propTypes = {
  children: React.PropTypes.element
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(
  mapStateToProps, {
    openAlert,
    openModal,
    closeModal
  })(RxRefillsApp);
