import React from 'react';

const ProfileSectionHeadline = ({ children }) => {
  return (
    <h2
      tabIndex="-1"
      className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
      data-focus-target
    >
      {children}
      <span className="sr-only"> section</span>
    </h2>
  );
};

export default ProfileSectionHeadline;
