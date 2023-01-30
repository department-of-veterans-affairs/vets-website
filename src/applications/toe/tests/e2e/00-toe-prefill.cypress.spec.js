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

    cy.get('input[id="root_view:userFullName_userFullName_first"]').should(
      'have.value',
      toeUser.data.attributes.profile.firstName,
    );
    cy.get('input[id="root_view:userFullName_userFullName_middle"]').should(
      'have.value',
      toeUser.data.attributes.profile.middleName,
    );
    cy.get('input[id="root_view:userFullName_userFullName_last"]').should(
      'have.value',
      toeUser.data.attributes.profile.lastName,
    );

    let toeBirthMonthNum = toeClaimantTestData.data.attributes.claimant.dateOfBirth.substring(
      5,
      7,
    );
    let toeBirthDayNum = toeClaimantTestData.data.attributes.claimant.dateOfBirth.substring(
      8,
    );
    let toeBirthYearNum = toeClaimantTestData.data.attributes.claimant.dateOfBirth.substring(
      0,
      4,
    );
    if (toeBirthMonthNum.startsWith('0')) {
      toeBirthMonthNum = toeBirthMonthNum.substring(1, 2);
    }
    if (toeBirthDayNum.startsWith('0')) {
      toeBirthDayNum = toeBirthDayNum.substring(1, 2);
    }
    if (toeBirthYearNum.startsWith('0')) {
      toeBirthYearNum = toeBirthYearNum.substring(1, 2);
    }
    cy.get('select[id*="root_dateOfBirthMonth"] option:selected').should(
      'have.value',
      toeBirthMonthNum,
    );
    cy.get('select[id*="root_dateOfBirthDay"] option:selected').should(
      'have.value',
      toeBirthMonthNum,
    );
    cy.get('input[id="root_dateOfBirthYear"]').should(
      'have.value',
      toeBirthYearNum,
    );
    cy.findByText('Continue').click();
  });

  it('Toe Sponsor page fields are prefilled', () => {
    cy.findByText('Continue').click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/sponsor-selection',
    );

    const sponsorName1 =
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .firstName +
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .lastName;
    const sponsorName2 =
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[1]
        .firstName +
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .lastName;
    const sponsorName3 =
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[2]
        .firstName +
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .lastName;
    cy.get('label')
      .contains(sponsorName1)
      .should('exist');
    cy.get('label')
      .contains(sponsorName2)
      .should('exist');
    cy.get('label')
      .contains(sponsorName3)
      .should('exist');
  });
});
