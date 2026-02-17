import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from '../fixtures/vitals.json';
import defaultVitals from '../fixtures/vitals.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits View Vitals List', () => {
    VitalsListPage.goToVitals();
    cy.url().should('not.include', `timeFrame`);

    VitalsListPage.verifyVitalOnListPage(
      0,
      'Blood pressure',
      `${defaultVitals.entry[0].resource.component[0].valueQuantity.value}/${defaultVitals.entry[0].resource.component[1].valueQuantity.value}`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[0].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      1,
      'Heart rate',
      `${defaultVitals.entry[4].resource.valueQuantity.value} beats per minute`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[4].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      2,
      'Breathing rate',
      `${defaultVitals.entry[7].resource.valueQuantity.value} breaths per minute`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[7].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      3,
      'Blood oxygen level',
      `${defaultVitals.entry[6].resource.valueQuantity.value}%`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[6].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      4,
      'Temperature',
      `${defaultVitals.entry[8].resource.valueQuantity.value} °F`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[8].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      5,
      'Weight',
      `${defaultVitals.entry[9].resource.valueQuantity.value} pounds`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[9].resource.effectiveDateTime,
      ),
    );

    VitalsListPage.verifyVitalOnListPage(
      6,
      'Height',
      `${Math.floor(
        defaultVitals.entry[3].resource.valueQuantity.value / 12,
      )} feet, ${
        defaultVitals.entry[3].resource.valueQuantity.value % 12
      } inches`,
      formatDateMonthDayCommaYear(
        defaultVitals.entry[3].resource.effectiveDateTime,
      ),
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
