import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeDisclaimer } from '../actions/disclaimer';
import { closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions';
import Disclaimer from '../components/Disclaimer';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

class RxRefillsApp extends React.Component {
  render() {
    const view = (
      <div>
        <div className="rx-app row">
          <Disclaimer
              isOpen={this.props.disclaimer.open}
              handleClose={this.props.closeDisclaimer}/>
          {this.props.children}
        </div>
        <ConfirmRefillModal
            prescription={this.props.refillModal.prescription}
            isVisible={this.props.refillModal.visible}
            refillPrescription={this.props.refillPrescription}
            onCloseModal={this.props.closeRefillModal}/>
        <GlossaryModal
            content={this.props.glossaryModal.content}
            isVisible={this.props.glossaryModal.visible}
            onCloseModal={this.props.closeGlossaryModal}/>
      </div>
    );

    return (
      <RequiredLoginView authRequired={3} serviceRequired={"rx"}>
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
  closeDisclaimer,
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
