/// <reference types='cypress' />

import { mebUser } from '../fixtures/userResponse';
import { mockClaimStatus } from '../fixtures/mockClaimStatusEligible';

describe('All Field, texts and links should be validated on letters app', () => {
  it.skip('All texts are present for the letters page unauthenticated', () => {
    cy.visit('http://localhost:3001/education/download-letters/');

    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/download-letters/');

    cy.get('.va-introtext').should(
      'have.text',
      'If you’re a Veteran and you recently received your VA education decision letter, you can download it now.',
    );
    cy.findByTestId('form-title').should(
      'have.text',
      'Download your VA education letter',
    );
    cy.findByText('Who can download VA education letters?').should(
      'be.visible',
    );
    cy.findByText(
      'You can download your education letter if you’re a Veteran and you meet both of the requirements listed here. At this time, family members and dependents can’t get their education letters online.',
    ).should('be.visible');
  });

  it.skip('All texts are present for the letters page authenticated but no letter', () => {
    cy.login(mebUser);
    cy.intercept(
      'GET',
      '/meb_api/v0/claim_status?latest=true',
      mockClaimStatus,
    ).as('mockClaimStatus');
    cy.visit('http://localhost:3001/education/download-letters/');

    cy.get('a[href*="/education/download-letters/letters"').click();
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/download-letters/letters');

    cy.get('.va-introtext').should(
      'have.text',
      'If you’re a Veteran and you recently received your VA education decision letter, you can download it now.',
    );
    cy.findByTestId('form-title').should(
      'have.text',
      'Download your VA education letter',
    );
    cy.findByText('Your decision letter isn’t available online').should(
      'be.visible',
    );
    cy.findByText(
      'Your letter won’t be here if 1 of these situations is true for you:',
    ).should('be.visible');
  });

  it.skip('All texts are present for the letters page authenticated with letter', () => {
    cy.intercept(
      'GET',
      '/meb_api/v0/claim_status?latest=true',
      mockClaimStatus,
    ).as('mockClaimStatus');
    cy.login(mebUser);

    cy.visit('http://localhost:3001/education/download-letters/letters');
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/download-letters/letters');
    cy.findByTestId('form-title').should(
      'have.text',
      'Download your VA education decision letter',
    );

    cy.get('a[href*="/meb_api/v0/claim_letter"]').should('be.visible');
    cy.findByText('How do I download and open a letter?').should('be.visible');
  });
});
