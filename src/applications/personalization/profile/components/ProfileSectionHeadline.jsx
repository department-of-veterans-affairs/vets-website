import React from 'react';
import PropTypes from 'prop-types';

const ProfileSectionHeadline = ({ children, dataTestId }) => {
  return (
    <h1
      tabIndex="-1"
      className="vads-u-margin-bottom--2"
      data-focus-target
      data-testid={dataTestId}
    >
      {children}
    </h1>
  );
};

ProfileSectionHeadline.propTypes = {
  children: PropTypes.node.isRequired,
  dataTestId: PropTypes.string,
};

export default ProfileSectionHeadline;
