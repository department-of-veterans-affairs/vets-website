import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import { openAlert } from '../actions/alert.js';
import { closeDisclaimer } from '../actions/disclaimer.js';
import { openRefillModal, closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions.js';
import Disclaimer from '../components/Disclaimer';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

class RxRefillsApp extends React.Component {
  render() {
    const view = (
      <div>
        <Disclaimer
            isOpen={this.props.disclaimer.open}
            handleClose={this.props.closeDisclaimer}/>
        <div className="rx-app row">
          {this.props.children}
        </div>
        <ConfirmRefillModal
            {...this.props.refillModal.prescription}
            isVisible={this.props.refillModal.visible}
            openAlert={this.props.openAlert}
            refillPrescription={this.props.refillPrescription}
            onCloseModal={this.props.closeRefillModal}/>
        <GlossaryModal
            content={this.props.glossaryModal.content}
            isVisible={this.props.glossaryModal.visible}
            onCloseModal={this.props.closeGlossaryModal}/>
      </div>
    );

    return (
      <RequiredLoginView authRequired={3}>
        {view}
      </RequiredLoginView>
    );
  }
}

RxRefillsApp.propTypes = {
  children: React.PropTypes.element
};

const mapStateToProps = (state) => {
  const modals = state.modals;

  return {
    disclaimer: state.disclaimer,
    glossaryModal: modals.glossary,
    refillModal: modals.refill
  };
};

const mapDispatchToProps = {
  openAlert,
  openRefillModal,
  closeDisclaimer,
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
