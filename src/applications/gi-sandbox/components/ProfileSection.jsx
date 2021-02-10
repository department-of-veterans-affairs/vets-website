import React from 'react';

import { createId } from '../utils/helpers';

export const ProfileSection = ({ name, children }) => (
  <li>
    <h2 id={createId(name)}>{name}</h2>
    {children}
  </li>
);

export default ProfileSection;
