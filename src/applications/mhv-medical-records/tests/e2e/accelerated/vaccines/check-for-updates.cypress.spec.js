import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vaccines from '../pages/Vaccines';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vaccinesData from '../fixtures/vaccines/sample-lighthouse.json';

describe('Medical Records - Accelerated Vaccines Check For Updates', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVaccines: true,
    });
  });

  it('calls v2 immunizations endpoint when accelerating vaccines is enabled', () => {
    // Set up intercepts for the v2 endpoint
    Vaccines.setIntercepts({ vaccinesData });

    // Also intercept v2 endpoint to verify it's called for check updates
    cy.intercept('GET', '/my_health/v2/medical_records/immunizations*').as(
      'v2ImmunizationsList',
    );

    // Should NOT call v1 when accelerating
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines*').as(
      'v1VaccinesList',
    );

    site.loadPage();
    Vaccines.goToVaccinesPage();

    // Wait for the v2 endpoint to be called
    cy.wait('@v2ImmunizationsList').then(interception => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Verify the vaccines list is displayed
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    cy.injectAxeThenAxeCheck();
  });

  it('does not call v1 vaccines endpoint when accelerating vaccines is enabled', () => {
    // Set up intercepts
    Vaccines.setIntercepts({ vaccinesData });

    // Track calls to v1 endpoint - this should NOT be called
    let v1Called = false;
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines*', req => {
      v1Called = true;
      req.reply(vaccinesData);
    }).as('v1VaccinesList');

    site.loadPage();
    Vaccines.goToVaccinesPage();

    // Wait for page to load
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    // Verify v1 was not called
    cy.wrap(null).then(() => {
      expect(v1Called).to.equal(false);
    });
    cy.injectAxeThenAxeCheck();
  });
});

describe('Medical Records - Non-Accelerated Vaccines Check For Updates', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // Default feature toggles have acceleration disabled
  });

  it('calls v1 vaccines endpoint when accelerating vaccines is disabled', () => {
    // Set up intercepts for the v1 endpoint
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines*', req => {
      req.reply(vaccinesData);
    }).as('v1VaccinesList');

    // v2 should NOT be called
    let v2Called = false;
    cy.intercept('GET', '/my_health/v2/medical_records/immunizations*', req => {
      v2Called = true;
      req.reply(vaccinesData);
    }).as('v2ImmunizationsList');

    cy.visit('my-health/medical-records/vaccines');

    // Wait for the v1 endpoint to be called
    cy.wait('@v1VaccinesList').then(interception => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Verify the vaccines list is displayed
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    // Verify v2 was not called
    cy.wrap(null).then(() => {
      expect(v2Called).to.equal(false);
    });

    cy.injectAxeThenAxeCheck();
  });
});
