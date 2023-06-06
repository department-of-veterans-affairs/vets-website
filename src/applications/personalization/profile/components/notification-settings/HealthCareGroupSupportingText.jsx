import React from 'react';
import { connect } from 'react-redux';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const HealthCareGroupSupportingText = ({ authenticatedWithSSOe }) => {
  return (
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
      <a
        href={mhvUrl(authenticatedWithSSOe, 'home')}
        rel="noreferrer noopener"
        target="_blank"
      >
        Manage your health care email notifications on My HealtheVet
      </a>
    </p>
  );
};

const mapStateToProps = state => {
  return {
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

export default connect(mapStateToProps)(HealthCareGroupSupportingText);
