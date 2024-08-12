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
    // click height link
    VitalsListPage.clickLinkByRecordListItemIndex(6);

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[3].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[3].resource.valueQuantity.value} inches`,
      defaultVitals.entry[3].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[13].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[13].resource.valueQuantity.value} inches`,
      defaultVitals.entry[13].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[23].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[23].resource.valueQuantity.value} inches`,
      defaultVitals.entry[23].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[33].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[33].resource.valueQuantity.value} inches`,
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
