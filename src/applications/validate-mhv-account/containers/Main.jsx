import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';

class Main extends React.Component {
  componentDidUpdate(prevProps) {
    const { loadingProfile, loggedIn } = this.props;
    if (prevProps.loadingProfile && !loadingProfile) {
      if (!loggedIn) {
        window.location = '/';
      }
    }
  }

  render() {
    const { loadingProfile, children, loggedIn } = this.props;
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          {loadingProfile && (
            <LoadingIndicator
              setFocus
              messsage="Loading your health account information..."
            />
          )}
          {!loadingProfile && loggedIn && children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading } = profile;
  return {
    loggedIn: isLoggedIn(state),
    loadingProfile: loading,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(Main),
);
