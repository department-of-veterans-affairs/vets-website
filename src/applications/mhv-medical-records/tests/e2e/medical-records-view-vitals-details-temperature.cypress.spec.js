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

  it('Vitals Details Temperature', () => {
    VitalsListPage.goToVitals();
    // click vitals page temperature link
    VitalsListPage.clickLinkByRecordListItemIndex(4);

    // verify first reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[8].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '99 °F',
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      // 'ADTP BURNETT', // location
      defaultVitals.entry[8].resource.contained[0].name,
      'None noted',
    );

    // verify second reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[18].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '98.5 °F',
      `${defaultVitals.entry[18].resource.valueQuantity.value} °F`,
      // '23 HOUR OBSERVATION', // location
      defaultVitals.entry[18].resource.contained[0].name,
      'None noted',
    );

    // verify third reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      // 'August',
      moment
        .parseZone(defaultVitals.entry[28].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '98.5 °F',
      `${defaultVitals.entry[28].resource.valueQuantity.value} °F`,
      // 'ADMISSIONS (LOC)', // location
      defaultVitals.entry[28].resource.contained[0].name,
      'None noted',
    );

    // verify fourth reading
    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      // 'May',
      moment
        .parseZone(defaultVitals.entry[38].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      // '98.5 °F',
      `${defaultVitals.entry[38].resource.valueQuantity.value} °F`,
      // 'ADTP SCREENING', // location
      defaultVitals.entry[38].resource.contained[0].name,
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
