import React from 'react';

import { logout } from '../../../user/authentication/utilities';

export default function LegacyDropdown() {
  return (
    <ul>
      <li><a href="/profile">Account</a></li>
      <li><a href="#" onClick={logout}>Sign Out</a></li>
    </ul>
  );
}
