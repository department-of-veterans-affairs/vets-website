import { appName } from '../../../manifest.json';
import { USER_MOCKS } from '../../../mocks/api/user';
import LandingPage from '../pages/LandingPage';

describe(`${appName} -- Alerts`, () => {
  [
    { user: USER_MOCKS.UNREGISTERED, testId: 'mhv-alert--unregistered' },
    { user: USER_MOCKS.UNVERIFIED, testId: 'mhv-alert--verify-and-register' },
    // { user: USER_MOCKS.DS_LOGON_UNVERIFIED, testId: 'verify-identity-alert-headline' },
    { user: USER_MOCKS.NO_MHV_ACCOUNT, testId: 'mhv-alert--mhv-registration' },
    {
      user: USER_MOCKS.MHV_BASIC_ACCOUNT,
      testId: 'mhv-alert--mhv-basic-account',
    },
  ].forEach(({ user, testId }) => {
    it(`renders ${testId}`, () => {
      LandingPage.visit({ user });
      cy.findByTestId(testId);
      cy.injectAxeThenAxeCheck();
    });
  });
});
