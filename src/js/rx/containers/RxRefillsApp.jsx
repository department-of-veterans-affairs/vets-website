import React from 'react';
import { connect } from 'react-redux';

// import RequiredLoginView from '../../common/components/RequiredLoginView';
import { openAlert } from '../actions/alert.js';
import { closeDisclaimer } from '../actions/disclaimer.js';
import { openRefillModal, closeRefillModal, closeGlossaryModal } from '../actions/modal.js';
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

    return view;

    /*
    return (
      <RequiredLoginView authRequired={3} component={view}/>
    );
    */
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
    closeDisclaimer,
    closeGlossaryModal,
    closeRefillModal,
    refillPrescription
  })(RxRefillsApp);
