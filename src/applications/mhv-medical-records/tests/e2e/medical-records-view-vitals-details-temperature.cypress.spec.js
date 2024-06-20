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
    // click temperature link
    VitalsListPage.clickLinkByRecordListItemIndex(4);

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[8].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      defaultVitals.entry[8].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[18].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[18].resource.valueQuantity.value} °F`,
      defaultVitals.entry[18].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[28].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[28].resource.valueQuantity.value} °F`,
      defaultVitals.entry[28].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[38].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[38].resource.valueQuantity.value} °F`,
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
