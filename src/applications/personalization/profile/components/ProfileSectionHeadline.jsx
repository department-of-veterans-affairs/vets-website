import React from 'react';

const ProfileSectionHeadline = ({ children }) => {
  return (
    <h1
      tabIndex="-1"
      className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
      data-focus-target
    >
      {children}
    </h1>
  );
};

export default ProfileSectionHeadline;
