import React from 'react';
import PropTypes from 'prop-types';

const ProfileSectionHeadline = ({ children }) => {
  return (
    <h2 className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3">
      {children}
      <span className="sr-only"> section</span>
    </h2>
  );
};

ProfileSectionHeadline.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ProfileSectionHeadline;
