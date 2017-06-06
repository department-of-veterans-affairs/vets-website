import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';
import RequiredLoginView from '../../common/components/RequiredLoginView';

import { getEnrollmentData } from '../actions/post-911-gib-status';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        To view your Post-9/11 GI Bill status, you need to verify your identity (or whatever).
      </h4>
    );
  } else {
    view = children;
  }
  return (
    <div>
      {view}
    </div>
  );
}

class Post911GIBStatusApp extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    // TODO: change the service name below from "user-profile" to
    // something like "post-911-gib-status" once its defined in vets-api
    const { enrollmentState } = this.props;
    const name = enrollmentState ? `${enrollmentState.firstName} ${enrollmentState.lastName}` : '';

    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"user-profile"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
              <FormTitle title="Post-9/11 GI Bill Status"/>
              <div className="va-introtext">
                <p>
                  View your Post-9/11 GI Bill enrollment information below. This is the same information
                  in your Certificate of Eligibility (COE) letter. In lieu of a COE letter, you can
                  print a copy of this screen for benefit and eligibility verification.
                </p>
              </div>
              <div className="info-container usa-width-two-thirds medium-8 columns">
                Placeholder content: {name}
              </div>
              {this.props.children}
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
    verifyUrl: userState.login.verifyUrl,
    enrollmentState: state.post911GIBStatus.enrollmentData
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Post911GIBStatusApp);
