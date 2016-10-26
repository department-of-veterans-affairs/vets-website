import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import { openAlert } from '../actions/alert.js';
import { openRefillModal, closeRefillModal, closeGlossaryModal } from '../actions/modal.js';
import { refillPrescription } from '../actions/prescriptions.js';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

class RxRefillsApp extends React.Component {
  render() {
    const view = (
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

    return (
      <RequiredLoginView authRequired={3} component={view}/>
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
    openRefillModal,
    closeGlossaryModal,
    closeRefillModal,
    refillPrescription
  })(RxRefillsApp);
