import React from 'react';

import { createId } from '../utils/helpers';

export const ProfileSection = ({ name, children }) => (
  <div>
    <h2 id={createId(name)}>{name}</h2>
    {children}
  </div>
);

export default ProfileSection;
