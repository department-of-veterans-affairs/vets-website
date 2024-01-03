/// <reference types='cypress' />

import { mebUser } from '../fixtures/userResponse';
import { mockClaimStatus } from '../fixtures/mockClaimStatusEligible';

describe('All Field, texts and links should be validated on letters app', () => {
  it('All texts are present for the letters page unauthenticated', () => {
    cy.visit('/education/download-letters/');
    cy.url().should('include', '/education/download-letters/');

    cy.get('.va-introtext').should(
      'include.text',
      'If we made a decision on your application for Post-9/11 GI Bill benefits, you may be able to download your education decision letter now.',
    );

    cy.get('h1').should('include.text', 'Download your VA education letter');

    cy.findByText('Who can download an education decision letter?').should(
      'be.visible',
    );

    cy.findByText(
      'You can download your decision letter if you’re a Veteran and you meet both of the requirements listed here.',
    ).should('be.visible');

    cy.injectAxeThenAxeCheck();
  });

  it('All texts are present for the letters page authenticated but no letter', () => {
    cy.login(mebUser);
    cy.intercept(
      'GET',
      '/meb_api/v0/claim_status?latest=true',
      mockClaimStatus,
    ).as('mockClaimStatus');
    cy.visit('/education/download-letters/');

    cy.get('a[href*="/education/download-letters/letters"').click();
    cy.url().should('include', '/education/download-letters/letters');

    cy.get('.va-introtext').should(
      'include.text',
      'Check this page for your education decision letter for Post-9/11 GI Bill benefits.',
    );
    cy.get('a.decision-letter-download').should(
      'include.text',
      'Download your education decision letter',
    );
    cy.findByText('What if my education decision letter isn’t here?').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('All texts are present for the letters page authenticated with letter', () => {
    cy.intercept(
      'GET',
      '/meb_api/v0/claim_status?latest=true',
      mockClaimStatus,
    ).as('mockClaimStatus');
    cy.login(mebUser);

    cy.visit('/education/download-letters/letters');
    cy.url().should('include', '/education/download-letters/letters');
    cy.get('h1').should('include.text', 'Your VA education letter');

    cy.injectAxeThenAxeCheck();
  });
});
