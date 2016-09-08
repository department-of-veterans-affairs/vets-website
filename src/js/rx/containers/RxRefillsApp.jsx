import React from 'react';
import { connect } from 'react-redux';

import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

import { openAlert } from '../actions/alert.js';
import { openRefillModal, closeRefillModal, openGlossaryModal, closeGlossaryModal } from '../actions/modal.js';
import { refillPrescription } from '../actions/prescriptions.js';

class RxRefillsApp extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <ConfirmRefillModal
            {...this.props.modal.refill.prescription}
            isVisible={this.props.modal.refill.visible}
            openAlert={this.props.openAlert}
            refillPrescription={this.props.refillPrescription}
            onCloseModal={this.props.closeRefillModal}/>
        <GlossaryModal
            content={this.props.modal.glossary.content}
            isVisible={this.props.modal.glossary.visible}
            onCloseModal={this.props.closeGlossaryModal}/>
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
    openGlossaryModal,
    openRefillModal,
    closeGlossaryModal,
    closeRefillModal,
    refillPrescription
  })(RxRefillsApp);
