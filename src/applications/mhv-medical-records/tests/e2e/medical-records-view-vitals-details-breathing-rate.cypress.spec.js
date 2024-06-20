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

  it('Vitals Details Breathing Rate', () => {
    VitalsListPage.goToVitals();
    // click vitals page Breathing Rate Link
    VitalsListPage.clickLinkByRecordListItemIndex(2);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[7].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '15 breaths per minute',
      `${
        defaultVitals.entry[7].resource.valueQuantity.value
      } breaths per minute`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[4].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[17].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '15 breaths per minute',
      `${
        defaultVitals.entry[17].resource.valueQuantity.value
      } breaths per minute`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[17].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[27].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '12 breaths per minute',
      `${
        defaultVitals.entry[27].resource.valueQuantity.value
      } breaths per minute`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[27].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[37].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '12 breaths per minute',
      `${
        defaultVitals.entry[37].resource.valueQuantity.value
      } breaths per minute`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[37].resource.contained[0].name,
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
