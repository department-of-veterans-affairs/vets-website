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

  it('Vitals Details Pulse Oximetry', () => {
    VitalsListPage.goToVitals();
    // click vitals page pulse oximetry Link
    VitalsListPage.clickLinkByRecordListItemIndex(3);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[6].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '98%',
      `${defaultVitals.entry[6].resource.valueQuantity.value}%`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[6].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[16].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '100%',
      `${defaultVitals.entry[16].resource.valueQuantity.value}%`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[16].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[26].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '95%',
      `${defaultVitals.entry[26].resource.valueQuantity.value}%`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[26].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[36].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '100%',
      `${defaultVitals.entry[36].resource.valueQuantity.value}%`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[36].resource.contained[0].name,
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
