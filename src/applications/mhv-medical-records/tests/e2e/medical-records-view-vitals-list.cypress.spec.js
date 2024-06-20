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

  it('Visits Medical Records View Vitals List', () => {
    VitalsListPage.goToVitals();

    VitalsListPage.verifyVitalOnListPage(
      0,
      'Blood pressure',
      // '130/70',
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${
        defaultVitals.entry[0].resource.component[1].valueQuantity.value
      }`,
      // 'October', //  27, 2023, 7:00 a.m. PDT
      moment
        .parseZone(defaultVitals.entry[0].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      1,
      'Heart rate',
      // '70 beats per minute',
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[4].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      2,
      'Breathing rate',
      // '15 breaths per minute',
      `${
        defaultVitals.entry[7].resource.valueQuantity.value
      } breaths per minute`,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[7].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      3,
      'Blood oxygen level',
      // '98%',
      `${defaultVitals.entry[6].resource.valueQuantity.value}%`,
      // 'October',
      moment
        .parseZone(defaultVitals.entry[6].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      4,
      'Temperature',
      // '99 °F',
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      // 'October'
      moment
        .parseZone(defaultVitals.entry[8].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      5,
      'Weight',
      // '185 pounds',
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      // 'October'
      moment
        .parseZone(defaultVitals.entry[9].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    VitalsListPage.verifyVitalOnListPage(
      6,
      'Height',
      // '70 inches'
      `${defaultVitals.entry[3].resource.valueQuantity.value} inches`,
      // 'October'
      moment
        .parseZone(defaultVitals.entry[3].resource.effectiveDateTime)
        .format('MMMM D, YYYY, h:mm'),
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
