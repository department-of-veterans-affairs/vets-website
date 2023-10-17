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

    cy.get('div a.vads-c-action-link--green:nth-child(2)')
      .contains('Start your benefit application')
      .click();
  });

  it('Toe Sponsor page fields are prefilled', () => {
    cy.findByText('Continue').click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/sponsor-selection',
    );

    const sponsorName1 = `${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .firstName
    } ${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[0]
        .lastName
    }`;
    const sponsorName2 = `${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[1]
        .firstName
    } ${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[1]
        .lastName
    }`;
    const sponsorName3 = `${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[2]
        .firstName
    } ${
      toeClaimantTestData.data.attributes.toeSponsors.transferOfEntitlements[2]
        .lastName
    }`;

    // verifying sponsor names exist on the page
    cy.get('div.form-checkbox-buttons')
      .eq(0)
      .find('label')
      .should('contain.text', sponsorName1);
    cy.get('div.form-checkbox-buttons')
      .eq(1)
      .find('label')
      .should('contain.text', sponsorName2);
    cy.get('div.form-checkbox-buttons')
      .eq(2)
      .find('label')
      .should('contain.text', sponsorName3);

    // verifiying error message is presented
    cy.findByText('Continue').click();

    cy.contains('Please select at least one sponsor').should('exist');

    // verifying error message is not presented
    cy.get('div.form-checkbox-buttons')
      .eq(0)
      .find('input')
      .click();
    cy.findByText('Continue').click();
    cy.contains('Please select at least one sponsor').should('not.exist');
  });

  it('Toe direct deposit page fields are prefilled, text and page elements verified', () => {
    cy.findByText('Continue').click();
    cy.get('div.form-checkbox-buttons')
      .eq(0)
      .find('input')
      .click();
    cy.findByText('Continue').click();
    cy.findByText('Continue').click();
    cy.findByText('Continue').click();
    cy.get('input[id*="root_contactMethod"][value="Email"]').check();
    cy.get('input[value="Yes, send me text message notifications"]').check();
    cy.findByText('Continue').click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/direct-deposit',
    );

    // direct deposit fields are required
    cy.findByText('Continue').click();
    cy.contains('Please provide a response').should('exist');
    cy.contains('Please enter a bank account number').should('exist');
    cy.contains('Please enter a routing number').should('exist');

    // validation check for account type, bank account number and routing number
    cy.get(
      'input[id*="root_bankAccount_accountType"][value="checking"]',
    ).click();
    cy.get('input[id*="root_bankAccount_accountNumber"]').type('1231231231');
    // entering less than 9 digit routing number
    cy.get('input[id*="root_bankAccount_routingNumber"]').type('12312312');
    cy.findByText('Continue').click();
    cy.contains('Please provide a response').should('not.exist');
    cy.contains('Please enter a valid nine digit routing number').should(
      'exist',
    );

    // entering more than 9 digit routing number
    cy.get('input[id*="root_bankAccount_routingNumber"]')
      .clear()
      .type('1231231221');
    cy.findByText('Continue').click();
    cy.contains('Please enter a valid nine digit routing number').should(
      'exist',
    );

    // entering 9 digits but wrong routing number
    cy.get('input[id*="root_bankAccount_routingNumber"]')
      .clear()
      .type('321321123');
    cy.findByText('Continue').click();
    cy.contains('Please enter a valid nine digit routing number').should(
      'exist',
    );

    // entering correct routing number
    cy.get('input[id*="root_bankAccount_routingNumber"]')
      .clear()
      .type('123123123');
    cy.findByText('Continue').click();
    cy.contains('Please enter a valid nine digit routing number').should(
      'not.exist',
    );
  });

  it('Toe application review page fields are prefilled, text and page elements verified', () => {
    cy.findByText('Continue').click();
    cy.get('div.form-checkbox-buttons')
      .eq(0)
      .find('input')
      .click();
    cy.findByText('Continue').click();
    cy.findByText('Continue').click();
    cy.findByText('Continue').click();
    cy.get('input[id*="root_contactMethod"][value="Email"]').check();
    cy.get('input[value="Yes, send me text message notifications"]').check();
    cy.findByText('Continue').click();
    cy.get(
      'input[id*="root_bankAccount_accountType"][value="checking"]',
    ).click();
    cy.get('input[id*="root_bankAccount_accountNumber"]').type('1231231231');
    cy.get('input[id*="root_bankAccount_routingNumber"]')
      .clear()
      .type('123123123');
    cy.findByText('Continue').click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/review-and-submit',
    );

    // verifying your information section in review page
    cy.get('button[id*="collapsibleButton"]').contains('Your information');

    // verifying Sponsor information section in review page

    cy.get('button[id*="collapsibleButton"]')
      .contains('Sponsor information')
      .click();
    cy.contains('Sponsor 1: Sharon Parker').should('exist');
    cy.get('button[id*="collapsibleButton"]')
      .contains('Sponsor information')
      .click();

    // verifying Contact information, mailing and contact preference section in review page
    cy.get('button[id*="collapsibleButton"]')
      .contains('Contact information')
      .click();
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo
        .mobilePhoneNumber,
    ).should('exist');
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo.homePhoneNumber,
    ).should('exist');
    cy.contains(toeUser.data.attributes.profile.email).should('exist');
    cy.contains('United States').should('exist');
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo.addressLine1,
    ).should('exist');
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo.addressLine2,
    ).should('exist');
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo.city,
    ).should('exist');
    cy.contains(
      toeClaimantTestData.data.attributes.claimant.contactInfo.zipcode,
    ).should('exist');
    cy.get('button[id*="collapsibleButton"]')
      .contains('Contact information')
      .click();

    // verify direct deposit information on review page
    cy.get('button[id*="collapsibleButton"]')
      .contains('Direct deposit')
      .click();
    cy.get('button[aria-label="Edit account information"]').click();
    cy.get(
      'input[id*="root_bankAccount_accountType"][value="checking"]',
    ).should('be.checked');
    cy.get('input[id="root_bankAccount_accountNumber"]').should(
      'have.value',
      '1231231231',
    );
    cy.get('input[id="root_bankAccount_routingNumber"]').should(
      'have.value',
      '123123123',
    );
    cy.get('[aria-label="Update Direct deposit"]').click();
    cy.get('button[id*="collapsibleButton"]')
      .contains('Direct deposit')
      .click();
  });
});
