/// <reference types='cypress' />

import { toeUser } from '../fixtures/data/toe-user-test-data';
import { toeClaimantTestData } from '../fixtures/data/toe-claimant-test-data';
import { toeBankInfoTestData } from '../fixtures/data/toe-bank-info-test-data';
import { toeFormTestData } from '../fixtures/data/toe-form-prefill-test-data';

describe('All Field prefilled tests for TOE app', () => {
  beforeEach(() => {
    cy.login(toeUser);
    cy.intercept(
      'GET',
      '/meb_api/v0/forms_claimant_info',
      toeClaimantTestData,
    ).as('toeClaimantTestData');

    cy.intercept(
      'GET',
      '/v0/profile/ch33_bank_accounts',
      toeBankInfoTestData,
    ).as('toeBankInfo');

    cy.visit(
      'http://localhost:3001/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/introduction',
    );

    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/introduction',
    );
    cy.injectAxeThenAxeCheck();
    cy.intercept(
      'GET',
      '/v0/in_progress_forms/22-1990EMEB',
      toeFormTestData,
    ).as('toeFormTestData');

    cy.get(
      'div a.vads-c-action-link--green.vads-u-padding-left--0:nth-child(2)',
    )
      .contains('Start your benefit application')
      .click();
  });

  it('Your information page fields are prefilled', () => {
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/apply-for-transferred-benefits-form-22-1990e/applicant-information',
    );
  });
});
