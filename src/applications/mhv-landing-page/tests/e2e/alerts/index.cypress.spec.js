import { appName } from '../../../manifest.json';
import { USER_MOCKS } from '../../../mocks/api/user';
import LandingPage from '../pages/LandingPage';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- Alerts`, () => {
  beforeEach(() => {
    LandingPage.initializeApi();
    ApiInitializer.initializeAccountStatus.with801();
  });

  [
    { user: USER_MOCKS.DS_LOGON_UNVERIFIED, testId: 'mhv-alert--unregistered' },
    { user: USER_MOCKS.UNVERIFIED, testId: 'mhv-alert--verify-and-register' },
    { user: USER_MOCKS.NO_MHV_ACCOUNT, testId: 'mhv-alert--mhv-registration' },
  ].forEach(({ user, testId }) => {
    it(`renders ${testId}`, () => {
      LandingPage.visit({ user });
      cy.findByTestId(testId);
      cy.injectAxeThenAxeCheck();
    });
  });
});
