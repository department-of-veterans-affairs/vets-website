import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import * as userSelectors from 'platform/user/selectors';

function Layout({ isProfileLoading, children }) {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--3">
        <h1>Request a COVID-19 vaccination</h1>
        {isProfileLoading ? (
          <LoadingIndicator message="Loading your profile..." />
        ) : (
          children
        )}
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
