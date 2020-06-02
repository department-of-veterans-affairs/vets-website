import AccountSecurity from './components/AccountSecurity';
import PersonalInformation from './components/personal-information/PersonalInformation';
import MilitaryInformation from './components/MilitaryInformation';
import DirectDeposit from './components/direct-deposit/DirectDeposit';
import ConnectedApplications from './components/connected-apps/ConnectedApps';

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
