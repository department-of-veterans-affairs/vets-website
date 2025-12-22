import React from 'react';
import LoginActions from 'platform/user/authentication/components/LoginActions';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';

const ArpLoginActions = () => (
  <LoginActions externalApplication={EXTERNAL_APPS.ARP} isUnifiedSignIn />
);

export default ArpLoginActions;
