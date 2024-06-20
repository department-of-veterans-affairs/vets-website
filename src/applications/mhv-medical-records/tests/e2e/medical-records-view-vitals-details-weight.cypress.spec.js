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

  it('Vitals Details Weight', () => {
    VitalsListPage.goToVitals();
    // click vitals page weight link
    VitalsListPage.clickLinkByRecordListItemIndex(5);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[9].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '185 pounds',
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[9].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[19].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '200 pounds',
      `${defaultVitals.entry[19].resource.valueQuantity.value} pounds`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[19].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[29].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '190 pounds',
      `${defaultVitals.entry[29].resource.valueQuantity.value} pounds`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[29].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[39].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '185 pounds',
      `${defaultVitals.entry[39].resource.valueQuantity.value} pounds`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[39].resource.contained[0].name,
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
