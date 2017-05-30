import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredTermsAcceptanceView from '../../common/components/RequiredTermsAcceptanceView';
import { closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        To refill prescriptions at this time, you need to be registered as a VA patient through MyHealtheVet.
        To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealtheVet</a>.
        If you're registered but you don't see your prescriptions here, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
      </h4>
    );
  } else {
    view = children;
  }

  return (
    <div className="rx-app">
      <div className="row">
        <div className="columns small-12">
          {view}
        </div>
      </div>
    </div>
  );
}

class RxRefillsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"rx"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <RequiredTermsAcceptanceView termsName={"mhvac"}>
          <AppContent>
            <Breadcrumbs location={this.props.location} prescription={this.props.prescription}/>
            {this.props.children}
            <ConfirmRefillModal
                prescription={this.props.refillModal.prescription}
                isLoading={this.props.refillModal.loading}
                isVisible={this.props.refillModal.visible}
                refillPrescription={this.props.refillPrescription}
                onCloseModal={this.props.closeRefillModal}/>
            <GlossaryModal
                content={this.props.glossaryModal.content}
                isVisible={this.props.glossaryModal.visible}
                onCloseModal={this.props.closeGlossaryModal}/>
          </AppContent>
        </RequiredTermsAcceptanceView>
      </RequiredLoginView>
    );
  }
}

RxRefillsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const modals = rxState.modals;
  const userState = state.user;

  return {
    glossaryModal: modals.glossary,
    refillModal: modals.refill,
    prescription: rxState.prescriptions.currentItem,
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
