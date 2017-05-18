import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';
import { getCurrentFormStep } from '../../common/utils/helpers';
import SegmentedProgressBar from '../../common/components/SegmentedProgressBar';
import NavHeader from '../../common/components/NavHeader';
import RequiredLoginView from '../../common/components/RequiredLoginView';

import { chapters } from '../routes';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        To view and download your VA letters, you need to verify your identity (or whatever).
      </h4>
    );
  } else {
    view = children;
  }

  return (
    // TODO: add HTML and CSS when design has settled
    <div className="usa-grid">
      {view}
    </div>
  );
}

class VALettersApp extends React.Component {
  render() {
    const { children, location } = this.props;

    return (
      // TODO: change the service name below from "user-profile" to
      // "evss-letters" or "va-letters" once its defined in vets-api
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"user-profile"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div className="usa-grid">
            <div className="usa-width-two-thirds">
              <FormTitle title="Download VA Letters"/>
              <SegmentedProgressBar total={chapters.length} current={getCurrentFormStep(chapters, location.pathname)}/>
              <div className="schemaform-chapter-progress">
                <NavHeader path={location.pathname} chapters={chapters} className="nav-header-schemaform"/>
              </div>
              <div className="form-panel">
                {children}
              </div>
            </div>
          </div>
        </AppContent>
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
}

export default connect(mapStateToProps)(VALettersApp);
