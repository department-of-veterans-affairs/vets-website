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

  it('Vitals Details Heart Rate', () => {
    VitalsListPage.goToVitals();
    // click vitals page Heart Rate Link
    VitalsListPage.clickLinkByRecordListItemIndex(1);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[4].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '70 beats per minute',
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[4].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[14].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '85 beats per minute',
      `${
        defaultVitals.entry[14].resource.valueQuantity.value
      } beats per minute`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[14].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[24].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '90 beats per minute',
      `${
        defaultVitals.entry[24].resource.valueQuantity.value
      } beats per minute`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[24].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[34].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '60 beats per minute',
      `${
        defaultVitals.entry[34].resource.valueQuantity.value
      } beats per minute`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[34].resource.contained[0].name,
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
