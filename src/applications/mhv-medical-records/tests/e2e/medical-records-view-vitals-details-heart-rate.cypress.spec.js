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
    // click heart rate link
    VitalsListPage.clickLinkByRecordListItemIndex(1);

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[4].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      defaultVitals.entry[4].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[14].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[14].resource.valueQuantity.value
      } beats per minute`,
      defaultVitals.entry[14].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[24].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[24].resource.valueQuantity.value
      } beats per minute`,
      defaultVitals.entry[24].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[34].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${
        defaultVitals.entry[34].resource.valueQuantity.value
      } beats per minute`,
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
