import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

import { getLetterList } from '../actions/letters';

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
    <div className="usa-grid">
      {view}
    </div>
  );
}

class VALettersApp extends React.Component {
  componentDidMount() {
    this.props.getLetterList();
  }

  render() {
    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"evss-claims"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
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
    verifyUrl: userState.login.verifyUrl
  };
}

const mapDispatchToProps = {
  getLetterList
};

export default connect(mapStateToProps, mapDispatchToProps)(VALettersApp);
