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
    // click breathing rate Link
    VitalsListPage.clickLinkByRecordListItem('Breathing rate');

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[7].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[7].resource.valueQuantity.value
      } breaths per minute`,
      defaultVitals.entry[4].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[17].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[17].resource.valueQuantity.value
      } breaths per minute`,
      defaultVitals.entry[17].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[27].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[27].resource.valueQuantity.value
      } breaths per minute`,
      defaultVitals.entry[27].resource.contained[0].name,
      'None recorded',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[37].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[37].resource.valueQuantity.value
      } breaths per minute`,
      defaultVitals.entry[37].resource.contained[0].name,
      'None recorded',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  // afterEach(() => {
  //   VitalsDetailsPage.clickBreadCrumbsLink(0);
  // });
});
