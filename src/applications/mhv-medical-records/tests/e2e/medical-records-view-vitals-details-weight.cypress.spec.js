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
    // click weight link
    VitalsListPage.clickLinkByRecordListItemIndex(5);

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[9].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[9].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[19].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[19].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[19].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[29].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[29].resource.valueQuantity.value} pounds`,
      defaultVitals.entry[29].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[39].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[39].resource.valueQuantity.value} pounds`,
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
