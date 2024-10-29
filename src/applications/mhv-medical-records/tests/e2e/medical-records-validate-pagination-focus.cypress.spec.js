// import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from '../fixtures/vitals.json';
// import defaultVitals from '../fixtures/vitals.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Visits View Vitals List', () => {
    VitalsListPage.goToVitals();

    VitalsListPage.loadVAPaginationNext();
    VitalsListPage.loadVAPaginationPrevious();

    cy.focused().should(
      'have.text',
      `Showing 1 to 10 of 10 records from newest to oldest`,
    );

    // VitalsListPage.verifyVitalOnListPage(
    //   0,
    //   'Blood pressure',
    //   `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${
    //     defaultVitals.entry[0].resource.component[1].valueQuantity.value
    //   }`,
    //   moment
    //     .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
    //     .format('MMMM D, YYYY, h:mm'),
    // );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
