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
    it('should conditionally display timezone message based on environment timezone', () => {
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
            expect(text).not.to.include('will show as received on');
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
          .and('contain.text', 'will show as received on')
          .and(
            'contain.text',
            'but we record your submissions when you upload them',
          )
          .invoke('text')
          .then(text => {
            // Verify VA.gov time format (e.g., "8:00 p.m." with periods)
            expect(text).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\./);

            // Verify directional language (after/before)
            expect(text).to.match(/(after|before)/);

            // Static message should use "next/previous day's date" NOT specific date
            expect(text).to.match(/(next|previous) day's date/);
          });
      }

      cy.axeCheck();
    });
  });

  describe('Documents Filed Timezone Message', () => {
    it('should conditionally display timezone message based on environment timezone', () => {
      setupFilesTab();

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      // Check the current timezone offset
      const currentOffset = new Date().getTimezoneOffset();

      if (currentOffset === 0) {
        // UTC timezone - message should NOT appear
        cy.log('Test running in UTC timezone - verifying NO message appears');
        cy.contains('h3', 'Documents filed')
          .parent()
          .find('p')
          .first()
          .invoke('text')
          .then(text => {
            expect(text).not.to.include('Files uploaded');
            expect(text).not.to.include('will show as received on');
          });
      } else {
        // Non-UTC timezone - message SHOULD appear
        cy.log(
          `Test running in non-UTC timezone (offset: ${currentOffset}) - verifying message appears`,
        );
        cy.contains('h3', 'Documents filed')
          .parent()
          .find('p')
          .first()
          .should('be.visible')
          .and('contain.text', 'Files uploaded')
          .and('contain.text', 'will show as received on')
          .and(
            'contain.text',
            'but we record your submissions when you upload them',
          )
          .invoke('text')
          .then(text => {
            // Verify VA.gov time format (e.g., "8:00 p.m." with periods)
            expect(text).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\./);

            // Verify directional language (after/before)
            expect(text).to.match(/(after|before)/);

            // Static message should use "next/previous day's date" NOT specific date
            expect(text).to.match(/(next|previous) day's date/);
          });
      }

      cy.axeCheck();
    });
  });

  describe('UTC Timezone Behavior', () => {
    it('should conditionally display timezone message based on environment timezone', () => {
      // This test validates that the timezone message appears/disappears
      // based on the actual timezone offset of the test environment.
      // In UTC (offset = 0), no message should appear.
      // In non-UTC timezones, the message should appear with "next/previous day's date".

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
            expect(text).not.to.include('will show as received on');
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
            expect(text).not.to.include('will show as received on');
          });
      } else {
        // Non-UTC timezone - message SHOULD appear with "next/previous day's date"
        cy.log(
          `Test running in non-UTC timezone (offset: ${currentOffset}) - verifying message appears`,
        );
        cy.contains('h3', 'Recent activity')
          .parent()
          .find('p')
          .first()
          .should('be.visible')
          .and('contain.text', 'Files uploaded')
          .and('contain.text', 'will show as received on the')
          .invoke('text')
          .then(text => {
            // Static message should use "next/previous day's date"
            expect(text).to.match(/(next|previous) day's date/);
          });

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
          .and('contain.text', 'will show as received on the')
          .invoke('text')
          .then(text => {
            // Static message should use "next/previous day's date"
            expect(text).to.match(/(next|previous) day's date/);
          });
      }

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
            expect(text).to.include('will show as received on');
            // Verify specific date format appears (Month D, YYYY)
            expect(text).to.match(/[A-Z][a-z]+ \d{1,2}, \d{4}/);
            expect(text).to.include(
              'but we record your submissions when you upload them',
            );
          }
        });

      cy.axeCheck();
    });
  });
});
