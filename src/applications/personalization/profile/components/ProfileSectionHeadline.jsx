import React from 'react';
import PropTypes from 'prop-types';

const ProfileSectionHeadline = ({ children, dataTestId, classes }) => {
  return (
    <h1
      tabIndex="-1"
      className={classes || 'vads-u-margin-bottom--2'}
      data-focus-target
      data-testid={dataTestId}
    >
      {children}
    </h1>
  );
};

ProfileSectionHeadline.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.string,
  dataTestId: PropTypes.string,
};

export default ProfileSectionHeadline;
