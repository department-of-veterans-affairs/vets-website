import ProfileWrapper from './components/ProfileWrapper';
import PersonalInformation from './components/PersonalInformation';
import MilitaryInformation from './components/MilitaryInformation';
import DirectDeposit from './components/DirectDeposit';
import AccountSecurity from './components/AccountSecurity';
import ConnectedApplications from './components/ConnectedApplications';

const personalInformation = {
  path: 'personal-information',
  component: PersonalInformation,
  key: 'personal-information',
  name: 'Personal and contact information',
};

const militaryInformation = {
  path: 'military-information',
  component: MilitaryInformation,
  key: 'military-information',
  name: 'Military information',
};

const directDeposit = {
  path: 'direct-deposit',
  component: DirectDeposit,
  key: 'direct-deposit',
  name: 'Direct deposit information',
};

const accountSecurity = {
  path: 'account-security',
  component: AccountSecurity,
  key: 'account-security',
  name: 'Account security',
};

const connectedApplications = {
  path: 'connected-applications',
  component: ConnectedApplications,
  key: 'connected-applications',
  name: 'Connected apps',
};

export const childRoutes = {
  personalInformation,
  militaryInformation,
  directDeposit,
  accountSecurity,
  connectedApplications,
};

const routes = {
  path: '/',
  component: ProfileWrapper,
  indexRoute: {
    onEnter: (nextState, replace) => {
      replace(personalInformation.path);
    },
  },
  childRoutes: Object.values(childRoutes),
};

export default routes;
