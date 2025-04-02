import MedicationsSite from './med_site/MedicationsSite';
import allergies from './fixtures/allergies.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import unAuthUser from './fixtures/unallowed-user.json';
import { Paths } from './utils/constants';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    site.unallowedUserLogin(unAuthUser);
    cy.intercept('GET', Paths.MED_LIST, prescriptions).as('medicationsList');
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.visit('/my-health/medications');
    cy.location('pathname').should('contain', '/my-health/');
    cy.location('pathname').should('not.contain', '/my-health/medications');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
