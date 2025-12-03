import {
  mockBaseEndpoints,
  setShowDocumentUploadStatus,
  setupClaimTest,
  verifyTitleBreadcrumbsHeading,
} from '../../support/helpers';
import { createBenefitsClaim } from '../../support/fixtures/benefitsClaims';

const FILES_PATH = 'files';

describe('Claim files', () => {
  describe('Files page', () => {
    beforeEach(() => {
      mockBaseEndpoints();
      cy.login();
      setupClaimTest({ claim: createBenefitsClaim(), path: FILES_PATH });
    });

    it('should have correct page title, breadcrumbs, and heading', () => {
      verifyTitleBreadcrumbsHeading({
        title:
          'Files for January 1, 2025 Compensation Claim | Veterans Affairs',
        thirdBreadcrumb: {
          name: 'Files for your compensation claim',
          href: '#content',
        },
        heading: { name: 'Claim files', level: 2 },
      });

      cy.findByText(
        'If you need to add evidence, you can do that here. You can also review the files associated with this claim.',
      );
      cy.axeCheck();
    });

    it('should display disability exam request alert', () => {
      cy.findByText('Request for an exam')
        .closest('va-alert')
        .within(() => {
          cy.findByText('We made a request for an exam on March 1, 2025');
          cy.findByText(
            'We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment.',
          );
          cy.findByRole('link', {
            name: 'About this notice for Disability exam for hearing',
          }).should(
            'have.attr',
            'href',
            '/track-claims/your-claims/123456789/needed-from-others/123456',
          );
        });

      cy.axeCheck();
    });

    it('should display request outside the VA alert', () => {
      cy.findByText('Reserve records')
        .closest('va-alert')
        .within(() => {
          cy.findByText('We made a request outside VA on April 1, 2025');
          cy.findByText('You don’t need to do anything.');
          cy.findByText(
            "We've requested your service records or treatment records from your reserve unit.",
          );
          cy.findByRole('link', {
            name: 'About this notice for Reserve records',
          }).should(
            'have.attr',
            'href',
            '/track-claims/your-claims/123456789/needed-from-others/654321',
          );
        });

      cy.axeCheck();
    });
  });

  describe('Feature flag: cstShowDocumentUploadStatus', () => {
    context('when disabled', () => {
      beforeEach(() => {
        mockBaseEndpoints({ features: [setShowDocumentUploadStatus(false)] });
        cy.login();
        setupClaimTest({ claim: createBenefitsClaim(), path: FILES_PATH });
      });

      it('should display additional evidence heading', () => {
        cy.findByRole('heading', { name: 'Additional evidence', level: 3 });

        cy.axeCheck();
      });

      it('should display documents filed heading and no documents message', () => {
        cy.findByRole('heading', { name: 'Documents filed', level: 3 });
        cy.findByText('You haven’t turned in any documents to the VA.');

        cy.axeCheck();
      });
    });

    context('when enabled', () => {
      beforeEach(() => {
        mockBaseEndpoints({ features: [setShowDocumentUploadStatus(true)] });
        cy.login();
        setupClaimTest({ claim: createBenefitsClaim(), path: FILES_PATH });
      });

      it('should display additional evidence heading', () => {
        cy.findByRole('heading', {
          name: 'Upload additional evidence',
          level: 3,
        });

        cy.axeCheck();
      });

      it('should display documents filed headings and messaging', () => {
        cy.findByRole('heading', {
          name: 'File submissions in progress',
          level: 3,
        });
        cy.findByText(
          'Documents you submitted for review using this tool, or the VA: Health and Benefits mobile app, that we haven’t received yet. It can take up to 2 days for us to receive them.',
        );
        cy.findByText('You don’t have any file submissions in progress.');

        cy.findByRole('heading', {
          name: 'Files received',
          level: 3,
        });
        cy.findByText(
          'Files we received after you submitted them using this tool or the VA: Health and Benefits mobile app. Files submitted by mail or in person, by you or by others, don’t appear in this tool.',
        );
        cy.findByText('We haven’t received any files yet.');

        cy.axeCheck();
      });

      it('should display other ways to send documents section', () => {
        cy.findByRole('heading', {
          name: 'Other ways to send your documents',
          level: 2,
        });
        cy.findByText(
          'Print a copy of each document and write your Social Security number on the first page. Then resubmit by mail or in person.',
        );

        cy.findByRole('heading', {
          name: 'Option 1: By mail',
          level: 3,
        });
        cy.findByText('Mail the document to this address:');

        cy.findByRole('heading', {
          name: 'Option 2: In person',
          level: 3,
        });
        cy.findByText('Bring the document to a VA regional office.');
        cy.get('va-link[href="/find-locations"]')
          .should('be.visible')
          .shadow()
          .should('have.text', 'Find a VA regional office near you');

        cy.findByRole('heading', {
          name: 'How to confirm we’ve received your documents',
          level: 3,
        });
        cy.findByText(
          'To confirm we’ve received a document you submitted by mail or in person, call us at 800-827-1000 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
        );

        cy.axeCheck();
      });
    });
  });
});
