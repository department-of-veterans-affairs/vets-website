import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';
import defaultVitals from '../fixtures/vitals.json';

describe('Medical Records Vitals Details Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Vitals Details Height', () => {
    VitalsListPage.goToVitals();
    // click vitals page height link
    VitalsListPage.clickLinkByRecordListItemIndex(6);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[3].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '70 inches',
      `${defaultVitals.entry[3].resource.valueQuantity.value} inches`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[3].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[13].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '72 inches',
      `${defaultVitals.entry[13].resource.valueQuantity.value} inches`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[13].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[23].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '70 inches',
      `${defaultVitals.entry[23].resource.valueQuantity.value} inches`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[23].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[33].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '70 inches',
      `${defaultVitals.entry[33].resource.valueQuantity.value} inches`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[33].resource.contained[0].name,
      'None noted',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
