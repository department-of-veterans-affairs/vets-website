import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import featureToggleDocumentUploadStatusEnabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-enabled.json';
import featureToggleClaimDetailV2Enabled from './fixtures/mocks/lighthouse/feature-toggle-claim-detail-v2-enabled.json';

describe('Other Ways to Send Documents Feature Toggle', () => {
  describe('when feature toggle is enabled', () => {
    beforeEach(() => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled, // customFeatureToggles
      );
      trackClaimsPage.verifyInProgressClaim(false);

      // Navigate to the files tab using the page object method
      trackClaimsPage.navigateToFilesTab();

      cy.get('.claim-files').should('be.visible');
    });

    it('should display all content correctly when feature toggle is enabled', () => {
      cy.get('[data-testid="other-ways-to-send-documents"]').should(
        'be.visible',
      );
      cy.get('[data-testid="other-ways-to-send-documents"] h2').should(
        'contain.text',
        'Other ways to send your documents',
      );

      cy.get('[data-testid="other-ways-to-send-documents"]').should(
        'contain.text',
        'Print a copy of each document and write your Social Security number on the first page. Then resubmit by mail or in person.',
      );

      // Mail Section
      cy.get('.other-ways-mail-section > h3').should(
        'contain.text',
        'Option 1: By mail',
      );

      cy.get('.other-ways-mail-section')
        .should('contain.text', 'Mail the document to this address:')
        .and('contain.text', 'Department of Veterans Affairs')
        .and('contain.text', 'Evidence Intake Center')
        .and('contain.text', 'PO Box 4444')
        .and('contain.text', 'Janesville, WI 53547-4444');

      cy.get('.other-ways-mail-section .va-address-block').should('be.visible');

      // In-Person Section
      cy.get('.other-ways-in-person-section > h3').should(
        'contain.text',
        'Option 2: In person',
      );

      cy.get('.other-ways-in-person-section').should(
        'contain.text',
        'Bring the document to a VA regional office',
      );

      cy.get('va-link[href="/find-locations"]')
        .should('be.visible')
        .and('have.attr', 'text', 'Find a VA regional office near you');

      // Confirmation Section
      cy.get('.other-ways-confirmation-section > h3').should(
        'contain.text',
        'How to confirm we\u2019ve received your documents',
      );

      cy.get('.other-ways-confirmation-section').should(
        'contain.text',
        'To confirm we\u2019ve received a document you submitted by mail or in person, call us at 800-827-1000 (TTY: 711). We\u2019re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
      );

      cy.axeCheck();
    });

    it('should display VA locations link with correct attributes', () => {
      cy.get('va-link[href="/find-locations"]')
        .should('be.visible')
        .and('have.attr', 'href', '/find-locations')
        .and('have.attr', 'text', 'Find a VA regional office near you');

      cy.axeCheck();
    });
  });

  describe('when feature toggle is disabled', () => {
    beforeEach(() => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleClaimDetailV2Enabled, // customFeatureToggles - only v2 enabled, not document upload status
      );

      // Verify we have an in-progress claim
      trackClaimsPage.verifyInProgressClaim(false);

      // Navigate to the files tab using the page object method
      trackClaimsPage.navigateToFilesTab();

      cy.get('.claim-files').should('be.visible');
    });

    it('should display old content when feature toggle is disabled', () => {
      // Should not see the new content
      cy.get('[data-testid="other-ways-to-send-documents"]').should(
        'not.exist',
      );
      cy.contains('Other ways to send your documents').should('not.exist');

      // Should see the old content instead
      cy.contains('Documents filed').should('be.visible');
      cy.contains('Additional evidence').should('be.visible');

      cy.axeCheck();
    });
  });
});
