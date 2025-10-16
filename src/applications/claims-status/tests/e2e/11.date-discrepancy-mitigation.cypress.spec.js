import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import featureToggleDocumentUploadStatusDisabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-disabled.json';

describe('Date Discrepancy Mitigation - Timezone Awareness', () => {
  const setupStatusTab = () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(
      claimsList,
      claimDetailsOpen,
      false,
      false,
      featureToggleDocumentUploadStatusDisabled,
    );
    trackClaimsPage.verifyInProgressClaim(true);
    cy.injectAxe();
  };

  const setupFilesTab = () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(
      claimsList,
      claimDetailsOpen,
      false,
      false,
      featureToggleDocumentUploadStatusDisabled,
    );
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    cy.injectAxe();
  };

  describe('Recent Activity Timezone Message', () => {
    it('should display timezone message when not in UTC', () => {
      setupStatusTab();

      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      // Assert message exists and is visible with correct content
      cy.contains('h3', 'Recent activity')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .and('contain.text', 'Files uploaded')
        .and('contain.text', 'will show as received on the')
        .and(
          'contain.text',
          'but we record your submissions when you upload them',
        )
        .invoke('text')
        .then(text => {
          // Verify VA.gov time format (e.g., "8:00 p.m." with periods)
          expect(text).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\./);

          // Verify directional language (after/before and next/previous)
          expect(text).to.match(/(after|before)/);
          expect(text).to.match(/(next|previous)/);

          // Verify consistent pairing: "after" with "next", "before" with "previous"
          const hasAfter = text.includes('after');
          const hasBefore = text.includes('before');
          const hasNext = text.includes('next');
          const hasPrevious = text.includes('previous');

          if (hasAfter) {
            expect(hasNext).to.be.true;
          }
          if (hasBefore) {
            expect(hasPrevious).to.be.true;
          }
        });

      cy.axeCheck();
    });
  });

  describe('Documents Filed Timezone Message', () => {
    it('should display timezone message when not in UTC', () => {
      setupFilesTab();

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      // Assert message exists and is visible with correct content
      cy.contains('h3', 'Documents filed')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .and('contain.text', 'Files uploaded')
        .and('contain.text', 'will show as received on the')
        .and(
          'contain.text',
          'but we record your submissions when you upload them',
        )
        .invoke('text')
        .then(text => {
          // Verify VA.gov time format (e.g., "8:00 p.m." with periods)
          expect(text).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\./);

          // Verify directional language (after/before and next/previous)
          expect(text).to.match(/(after|before)/);
          expect(text).to.match(/(next|previous)/);

          // Verify consistent pairing: "after" with "next", "before" with "previous"
          const hasAfter = text.includes('after');
          const hasBefore = text.includes('before');
          const hasNext = text.includes('next');
          const hasPrevious = text.includes('previous');

          if (hasAfter) {
            expect(hasNext).to.be.true;
          }
          if (hasBefore) {
            expect(hasPrevious).to.be.true;
          }
        });

      cy.axeCheck();
    });
  });

  describe('UTC Timezone Behavior', () => {
    it('should conditionally display timezone message based on environment timezone', () => {
      // This test validates that the timezone message appears/disappears
      // based on the actual timezone offset of the test environment.
      // In UTC (offset = 0), no message should appear.
      // In non-UTC timezones, the message should appear.

      setupStatusTab();

      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      // Check the current timezone offset
      const currentOffset = new Date().getTimezoneOffset();

      if (currentOffset === 0) {
        // UTC timezone - message should NOT appear
        cy.log('Test running in UTC timezone - verifying NO message appears');
        cy.contains('h3', 'Recent activity')
          .parent()
          .find('p')
          .first()
          .invoke('text')
          .then(text => {
            expect(text).not.to.include('Files uploaded');
            expect(text).not.to.include('will show as received on the');
          });

        // Navigate to Files tab and verify no message there either
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.navigateToFilesTab();

        cy.get('.documents-filed-container').should('be.visible');
        cy.contains('h3', 'Documents filed').should('be.visible');

        cy.contains('h3', 'Documents filed')
          .parent()
          .find('p')
          .first()
          .invoke('text')
          .then(text => {
            expect(text).not.to.include('Files uploaded');
            expect(text).not.to.include('will show as received on the');
          });
      } else {
        // Non-UTC timezone - message SHOULD appear
        cy.log(
          `Test running in non-UTC timezone (offset: ${currentOffset}) - verifying message appears`,
        );
        cy.contains('h3', 'Recent activity')
          .parent()
          .find('p')
          .first()
          .should('be.visible')
          .and('contain.text', 'Files uploaded')
          .and('contain.text', 'will show as received on the');

        // Navigate to Files tab and verify message appears there too
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.navigateToFilesTab();

        cy.get('.documents-filed-container').should('be.visible');
        cy.contains('h3', 'Documents filed').should('be.visible');

        cy.contains('h3', 'Documents filed')
          .parent()
          .find('p')
          .first()
          .should('be.visible')
          .and('contain.text', 'Files uploaded')
          .and('contain.text', 'will show as received on the');
      }

      cy.axeCheck();
    });
  });

  describe('Upload Success Notification - Timezone Note Conditional', () => {
    it('should conditionally include timezone note when upload crosses day boundary', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusDisabled,
      );
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.navigateToFilesTab();
      cy.injectAxe();

      trackClaimsPage.submitFilesForReview();

      // Notification should always appear with updated body message
      cy.get('va-alert')
        .should('be.visible')
        .find('p')
        .should('be.visible')
        .and('contain.text', 'Your file should be listed')
        .and('contain.text', "If it's not there, try refreshing")
        .invoke('text')
        .then(text => {
          // If "Note:" appears, verify it has the correct timezone message
          if (text.includes('Note:')) {
            // Verify timezone note format and content
            expect(text).to.include('Files uploaded');
            expect(text).to.include('will show as received on the');
            expect(text).to.include(
              'but we record your submissions when you upload them',
            );
            expect(text).to.match(/(after|before)/);
            expect(text).to.match(/(next|previous)/);

            // Log that the note appeared (helps with debugging)
            cy.log('Timezone note appeared - upload crossed day boundary');
          } else {
            // Log that note didn't appear (helps with debugging)
            cy.log('Timezone note did not appear - upload within same day');
          }
        });

      cy.axeCheck();
    });
  });

  describe('Upload Success Notification', () => {
    it('should display notification with date, time, and timezone in heading', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusDisabled,
      );
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.navigateToFilesTab();
      cy.injectAxe();

      trackClaimsPage.submitFilesForReview();

      cy.get('va-alert h2')
        .should('contain.text', 'We received your file upload on')
        .and('contain.text', 'at');

      cy.get('va-alert h2')
        .invoke('text')
        .should('match', /\d{1,2}:\d{2}\s+(a\.m\.|p\.m\.)/i);

      cy.axeCheck();
    });

    it('should display updated notification body message', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusDisabled,
      );
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.navigateToFilesTab();
      cy.injectAxe();

      trackClaimsPage.submitFilesForReview();

      cy.get('va-alert')
        .find('p')
        .should('be.visible')
        .and(
          'contain.text',
          'Your file should be listed in the Documents filed section',
        )
        .and('contain.text', "If it's not there, try refreshing the page");

      cy.axeCheck();
    });

    it('should optionally include timezone note in notification body', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusDisabled,
      );
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.navigateToFilesTab();
      cy.injectAxe();

      trackClaimsPage.submitFilesForReview();

      cy.get('va-alert')
        .find('p')
        .invoke('text')
        .then(text => {
          if (text.includes('Note:')) {
            expect(text).to.include('Files uploaded');
            expect(text).to.match(/(after|before)/);
            expect(text).to.include('will show as received on the');
            expect(text).to.match(/(next|previous)/);
            expect(text).to.include(
              'but we record your submissions when you upload them',
            );
          }
        });

      cy.axeCheck();
    });
  });
});
