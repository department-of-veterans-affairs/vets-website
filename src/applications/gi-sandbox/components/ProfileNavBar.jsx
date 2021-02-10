import React from 'react';

import { createId } from '../utils/helpers';

export const ProfileNavBar = ({ profileSections }) => (
  <div className="profile-nav-bar vads-u-background-color--gray-lightest vads-u-padding--2">
    {profileSections.map(section => (
      <span
        className="vads-u-margin-right--2"
        key={`${createId(section)}-nav-bar`}
      >
        <a href={`#${createId(section)}`}>{section}</a>
      </span>
    ))}
  </div>
);

export default ProfileNavBar;
