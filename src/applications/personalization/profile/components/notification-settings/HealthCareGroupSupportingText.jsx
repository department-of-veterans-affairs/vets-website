import React from 'react';
import { connect } from 'react-redux';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const HealthCareGroupSupportingText = ({ authenticatedWithSSOe }) => {
  return (
    <p>
      <strong>Note:</strong> You can manage your health care email notifications
      through{' '}
      <a
        href={mhvUrl(authenticatedWithSSOe, 'home')}
        rel="noreferrer noopener"
        target="_blank"
      >
        My HealtheVet
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
