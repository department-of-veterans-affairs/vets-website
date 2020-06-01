import { lazy } from 'react';

const AccountSecurity = lazy(() =>
  import('../profile-2/components/AccountSecurity'),
);
const ConnectedApplications = lazy(() =>
  import('../profile-2/components/connected-apps/ConnectedApps'),
);
const DirectDeposit = lazy(() =>
  import('../profile-2/components/direct-deposit/DirectDeposit'),
);
const MilitaryInformation = lazy(() =>
  import('../profile-2/components/MilitaryInformation'),
);
const PersonalInformation = lazy(() =>
  import('../profile-2/components/personal-information/PersonalInformation'),
);

export default [
  {
    component: PersonalInformation,
    name: 'Personal and contact Information',
    path: '/profile/personal-information',
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: MilitaryInformation,
    name: 'Military information',
    path: '/profile/military-information',
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: DirectDeposit,
    name: 'Direct deposit',
    path: '/profile/direct-deposit',
    requiresLOA3: true,
    requiresMVI: true,
  },
  {
    component: AccountSecurity,
    name: 'Account security',
    path: '/profile/account-security',
    requiresLOA3: false,
    requiresMVI: false,
  },
  {
    component: ConnectedApplications,
    name: 'Connected apps',
    path: '/profile/connected-applications',
    requiresLOA3: true,
    requiresMVI: true,
  },
];
