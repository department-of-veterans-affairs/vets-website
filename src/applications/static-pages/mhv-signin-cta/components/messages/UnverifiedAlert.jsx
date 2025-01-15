import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from '~/platform/user/authentication/components/VerifyAlert';

export const headingPrefix = 'Verify your identity';
export const mhvHeadingPrefix = 'You need to sign in with a different account';

/**
 * Alert to show a user that is not verified (LOA1).
 * @property {number} headerLevel the heading level
 */
const UnverifiedAlert = ({ headerLevel }) => {
  return <VerifyAlert headingLevel={headerLevel} />;
};

UnverifiedAlert.propTypes = {
  headerLevel: PropTypes.number,
};

export default UnverifiedAlert;
