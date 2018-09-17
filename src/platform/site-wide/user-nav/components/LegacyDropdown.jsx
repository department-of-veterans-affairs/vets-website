import React from 'react';

import { logout } from '../../../user/authentication/utilities';
import accountManifest from '../../../../applications/personalization/account/manifest.json';

export default function LegacyDropdown() {
  return (
    <ul>
      <li><a href={accountManifest.rootUrl}>Account</a></li>
      <li><a href="#" onClick={logout}>Sign Out</a></li>
    </ul>
  );
}
