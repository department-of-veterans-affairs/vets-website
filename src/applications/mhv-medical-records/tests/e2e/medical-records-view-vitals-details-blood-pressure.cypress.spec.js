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

  it('Vitals Details Blood Pressure', () => {
    VitalsListPage.goToVitals();
    // click blood pressure Link
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    VitalsDetailsPage.verifyVitalReadingByIndex(
      0,
      moment
        .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[0].resource.component[1].valueQuantity.value
      }`,
      defaultVitals.entry[0].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      1,
      moment
        .parseZone(defaultVitals.entry[10].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[10].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[10].resource.component[1].valueQuantity.value
      }`,
      defaultVitals.entry[10].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      2,
      moment
        .parseZone(defaultVitals.entry[20].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[20].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[20].resource.component[1].valueQuantity.value
      }`,
      defaultVitals.entry[20].resource.contained[0].name,
      'None noted',
    );

    VitalsDetailsPage.verifyVitalReadingByIndex(
      3,
      moment
        .parseZone(defaultVitals.entry[30].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
      `${defaultVitals.entry[30].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[30].resource.component[1].valueQuantity.value
      }`,
      defaultVitals.entry[30].resource.contained[0].name,
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
