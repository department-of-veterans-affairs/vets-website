import React from 'react';
import PropTypes from 'prop-types';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

// Custom loader component that uses the same message as our AppInitLoader
const CustomRequiredLoginLoader = () => (
  <div className="vads-u-margin-y--5" data-testid="req-loader">
    <va-loading-indicator set-focus message="Loading VA Claim Status..." />
  </div>
);

// Override the default RequiredLoginView with custom loading UI
const CustomRequiredLoginView = props => {
  // Intercept the user profile loading state to show our custom loader
  if (props.user.profile.loading) {
    return <CustomRequiredLoginLoader />;
  }

  // Otherwise, use the standard RequiredLoginView behavior
  return <RequiredLoginView {...props} />;
};

CustomRequiredLoginView.propTypes = {
  serviceRequired: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  user: PropTypes.object.isRequired,
  showProfileErrorMessage: PropTypes.bool,
  useSiS: PropTypes.bool,
  verify: PropTypes.bool,
  children: PropTypes.node,
};

export default CustomRequiredLoginView;
