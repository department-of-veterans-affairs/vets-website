/// <reference types='cypress' />

import { mebUser } from '../fixtures/userResponse';
import { mockClaimStatus } from '../fixtures/mockClaimStatus';

describe('All Field, texts and links should be validated on letters app', () => {
  it('All texts are present for the letters page unauthenticated', () => {
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

  it('All texts are present for the letters page authenticated but no letter', () => {
    cy.login(mebUser);
    cy.visit('http://localhost:3001/education/download-letters/');
    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/download-letters/');

    cy.get('.va-introtext').should(
      'have.text',
      'Download important documents about your education benefits here, including your decision letters. ',
    );
    cy.findByTestId('form-title').should(
      'have.text',
      'Your VA education letter',
    );
    cy.findByText(
      'Your letter is not available to you through this tool',
    ).should('be.visible');
    cy.findByText(
      'The letter displayed will be based on your most recent claim submission. If your decision was before August 20, 2022 – or you’re a family member or dependent – your decision letter will not be listed here. You can contact us through Ask VA to request a copy of your letter. Request your VA education letter through',
    ).should('be.visible');
  });

  it('All texts are present for the letters page authenticated with letter', () => {
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
      'Your VA education letter',
    );
    cy.findByText('You have a letter available for you to download').should(
      'be.visible',
    );

    cy.get('a[href*="/meb_api/v0/claim_letter"]').should('be.visible');
    cy.get('a[href*="/meb_api/v0/claim_letter"]').should(
      'have.text',
      'Download Post-9/11 GI Bill decision letter (PDF)',
    );

    cy.findByText('COE Decision Letter Update').should('be.visible');

    cy.findByText('How do I download and open a letter?').should('be.visible');
  });
});
