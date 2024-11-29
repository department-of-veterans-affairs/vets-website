import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts, Paths } from './utils/constants';
import zeroFilterCountRx from './fixtures/filter-count-zero-prescriptions.json';

describe('Medications List Page Recently Requested No Rx Option', () => {
  it('visits Medications List Page Filter Option Recently Requested Zero Results', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();

    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.clickfilterAccordionDropdownOnListPage();
    listPage.verifyFilterOptionsOnListPage(
      'Recently requested',
      'Refill requests in process or shipped in the last 15 days',
    );
    listPage.verifyFilterButtonWhenAccordionExpanded();
    listPage.clickFilterRadioButtonOptionOnListPage('Recently requested');
    listPage.clickFilterButtonOnAccordion(
      Paths.INTERCEPT.RECENTLY_REQUESTED_FILTER_LIST,
      zeroFilterCountRx,
    );
    listPage.verifyMessageForZeroFilterResultsOnListPage(
      Alerts.NO_FILTER_RESULTS,
    );
  });
});
