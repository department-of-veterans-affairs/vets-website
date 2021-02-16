import React from 'react';

import { createId } from '../utils/helpers';

export const ProfileSection = ({ name, children }) => (
  <li>
    <h2 id={createId(name)} className="profile-section-header">
      {name}
    </h2>
    <div id={`${createId(name)}-body`} className="profile-section-body">
      {children}
    </div>
  </li>
);

export default ProfileSection;
