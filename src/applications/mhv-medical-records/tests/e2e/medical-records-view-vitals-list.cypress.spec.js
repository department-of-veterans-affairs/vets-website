import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from '../fixtures/vitals.json';
import defaultVitals from '../fixtures/vitals.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Visits View Vitals List', () => {
    VitalsListPage.goToVitals();

    VitalsListPage.verifyVitalOnListPage(
      0,
      'Blood pressure',
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[0].resource.component[1].valueQuantity.value
      }`,
      moment
        .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      1,
      'Heart rate',
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      moment
        .parseZone(defaultVitals.entry[4].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      2,
      'Breathing rate',
      `${
        defaultVitals.entry[7].resource.valueQuantity.value
      } breaths per minute`,
      moment
        .parseZone(defaultVitals.entry[7].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      3,
      'Blood oxygen level',
      `${defaultVitals.entry[6].resource.valueQuantity.value}%`,
      moment
        .parseZone(defaultVitals.entry[6].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      4,
      'Temperature',
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      moment
        .parseZone(defaultVitals.entry[8].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      5,
      'Weight',
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      moment
        .parseZone(defaultVitals.entry[9].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      6,
      'Height',
      `${defaultVitals.entry[3].resource.valueQuantity.value} inches`,
      moment
        .parseZone(defaultVitals.entry[3].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
