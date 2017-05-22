import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '../components/Breadcrumbs';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredTermsAcceptanceView from '../../common/components/RequiredTermsAcceptanceView';
import Modal from '../../common/components/Modal';
import { closeModal } from '../actions/modal';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <div className="row">
        <div className="columns">
          <h4>
            To download your health records, you need to be registered as a VA patient with a premium MyHealtheVet account.
            To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealtheVet</a>.
            If you're registered but you still can't download your health records, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
          </h4>
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return <div className="bb-app">{view}</div>;
}

export class HealthRecordsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"health-records"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <RequiredTermsAcceptanceView termsName={"mhvac"}>
          <AppContent>
            <div>
              <div className="row">
                <div className="columns small-12">
                  <Breadcrumbs location={this.props.location}/>
                  {this.props.children}
                </div>
              </div>
              <Modal
                  cssClass="bb-modal"
                  contents={this.props.modal.content}
                  id="bb-glossary-modal"
                  onClose={this.props.closeModal}
                  title={this.props.modal.title}
                  visible={this.props.modal.visible}/>
            </div>
          </AppContent>
        </RequiredTermsAcceptanceView>
      </RequiredLoginView>
    );
  }
}

HealthRecordsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const hrState = state.health.hr;
  const userState = state.user;

  return {
    modal: hrState.modal,
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};
const mapDispatchToProps = {
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthRecordsApp);
