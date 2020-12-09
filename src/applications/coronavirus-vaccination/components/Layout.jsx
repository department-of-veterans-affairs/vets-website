import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import * as userSelectors from 'platform/user/selectors';

function Layout({ isProfileLoading, children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      <div className="vads-l-row">
        <div className="vads-l-col--12 large-screen:vads-l-col--8">
          {isProfileLoading ? (
            <LoadingIndicator message="Loading your profile..." />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isProfileLoading: userSelectors.isProfileLoading(state),
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
export { Layout };
