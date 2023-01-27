/// <reference types='cypress' />

import { toeUser } from '../fixtures/data/toe-user-test-data';

describe('All Field prefilled tests for TOE app', () => {
  beforeEach(() => {
    cy.login(toeUser);
    // cy.intercept('GET', '/meb_api/v0/claimant_info', claimantResponse).as(
    //   'mockClaimantInfoResponse',
    // );

    cy.visit(
      'http://localhost:3001/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/introduction',
    );
    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/introduction',
    );
    cy.injectAxeThenAxeCheck();
    cy.get(
      'div a.vads-c-action-link--green.vads-u-padding-left--0:nth-child(2)',
    )
      .contains('Start your application')
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
