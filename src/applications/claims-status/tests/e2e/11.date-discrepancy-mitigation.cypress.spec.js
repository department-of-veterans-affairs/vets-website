import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import featureToggleDocumentUploadStatusDisabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-disabled.json';

describe('Date Discrepancy Mitigation - Timezone Awareness', () => {
  // Timezone test data constants
  const TIMEZONES = {
    CST: {
      offset: 360,
      name: 'CST',
      description: 'UTC-6',
      cutoffTime: '6:00 p.m.',
      direction: 'after',
      dayRef: 'next',
    },
    JST: {
      offset: -540,
      name: 'JST',
      description: 'UTC+9',
      cutoffTime: '9:00 a.m.',
      direction: 'before',
      dayRef: 'previous',
    },
    UTC: { offset: 0, name: 'UTC', description: 'offset = 0' },
  };

  // Setup function that stubs timezone BEFORE page loads
  const setupWithTimezone = (timezoneOffset, navigateToFiles = false) => {
    cy.intercept('GET', '/v0/benefits_claims', claimsList);
    cy.intercept('GET', `/v0/benefits_claims/189685`, claimDetailsOpen);
    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      featureToggleDocumentUploadStatusDisabled,
    );

    cy.login();

    // Stub timezone BEFORE visiting the page
    cy.visit('/track-claims', {
      onBeforeLoad(win) {
        cy.stub(win.Date.prototype, 'getTimezoneOffset').returns(
          timezoneOffset,
        );
      },
    });

    // Navigate into claim details
    cy.get('.claim-list-item:first-child va-link')
      .shadow()
      .find('a')
      .click();
    cy.get('.claim-title').should('be.visible');

    // Navigate to files tab if requested
    if (navigateToFiles) {
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');
    }

    cy.injectAxe();
  };

  // Helper function to set up and submit files for upload tests
  const setupAndSubmitFiles = timezoneOffset => {
    setupWithTimezone(timezoneOffset, true);

    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.submitFilesForReview();
  };

  // Helper to verify timezone message content in Recent Activity or Documents Filed
  const verifyTimezoneMessage = (timezone, selector) => {
    cy.contains('h3', selector)
      .parent()
      .find('p')
      .first()
      .should('be.visible')
      .invoke('text')
      .then(text => {
        expect(text).to.include(
          `Files uploaded ${timezone.direction} ${timezone.cutoffTime}`,
        );
        expect(text).to.include(
          `will show with the ${timezone.dayRef} day's date.`,
        );
      });
  };

  // Helper to verify NO timezone message appears
  const verifyNoTimezoneMessage = selector => {
    cy.contains('h3', selector)
      .parent()
      .find('p')
      .first()
      .invoke('text')
      .then(text => {
        expect(text).not.to.include('Files uploaded');
      });
  };

  // Helper to verify upload notification heading and time format
  const verifyUploadNotificationHeading = () => {
    cy.get('va-alert h2')
      .should('contain.text', 'We received your file upload on')
      .and('contain.text', 'at');

    cy.get('va-alert h2')
      .invoke('text')
      .should('match', /\d{1,2}:\d{2}\s+(a\.m\.|p\.m\.)/i);
  };

  // Helper to verify timezone note in upload notification (or lack thereof)
  const verifyUploadTimezoneNote = timezone => {
    cy.get('va-alert')
      .find('p')
      .invoke('text')
      .then(text => {
        if (!timezone) {
          // UTC case - should NOT have timezone note
          expect(text).not.to.include('Note:');
          expect(text).not.to.include('Files uploaded');
        } else if (text.includes('Note:')) {
          // CST/JST case - timezone note appears (only during boundary hours)
          expect(text).to.include(
            `Files uploaded ${timezone.direction} ${timezone.cutoffTime}`,
          );
          expect(text).to.match(/as [A-Z][a-z]+ \d{1,2}, \d{4}\./);
        }
        // else: CST/JST but outside boundary hours - no note, which is fine
      });
  };

  describe('Recent Activity Timezone Message', () => {
    it('should display "after" message for CST timezone', () => {
      setupWithTimezone(TIMEZONES.CST.offset);

      cy.get('.recent-activity-container').should('be.visible');
      verifyTimezoneMessage(TIMEZONES.CST, 'Recent activity');

      cy.axeCheck();
    });

    it('should display "before" message for JST timezone', () => {
      setupWithTimezone(TIMEZONES.JST.offset);

      cy.get('.recent-activity-container').should('be.visible');
      verifyTimezoneMessage(TIMEZONES.JST, 'Recent activity');

      cy.axeCheck();
    });

    it('should NOT display timezone message for UTC timezone', () => {
      setupWithTimezone(TIMEZONES.UTC.offset);

      cy.get('.recent-activity-container').should('be.visible');
      verifyNoTimezoneMessage('Recent activity');

      cy.axeCheck();
    });
  });

  describe('Documents Filed Timezone Message', () => {
    it('should display "after" message for CST timezone', () => {
      setupWithTimezone(TIMEZONES.CST.offset, true);

      cy.get('.documents-filed-container').should('be.visible');
      verifyTimezoneMessage(TIMEZONES.CST, 'Documents filed');

      cy.axeCheck();
    });

    it('should display "before" message for JST timezone', () => {
      setupWithTimezone(TIMEZONES.JST.offset, true);

      cy.get('.documents-filed-container').should('be.visible');
      verifyTimezoneMessage(TIMEZONES.JST, 'Documents filed');

      cy.axeCheck();
    });

    it('should NOT display timezone message for UTC timezone', () => {
      setupWithTimezone(TIMEZONES.UTC.offset, true);

      cy.get('.documents-filed-container').should('be.visible');
      verifyNoTimezoneMessage('Documents filed');

      cy.axeCheck();
    });
  });

  describe('Upload Success Notification', () => {
    it('should display notification with date/time AND "after" timezone note for CST timezone', () => {
      setupAndSubmitFiles(TIMEZONES.CST.offset);

      verifyUploadNotificationHeading();
      verifyUploadTimezoneNote(TIMEZONES.CST);

      cy.axeCheck();
    });

    it('should display notification with date/time AND "before" timezone note for JST timezone', () => {
      setupAndSubmitFiles(TIMEZONES.JST.offset);

      verifyUploadNotificationHeading();
      verifyUploadTimezoneNote(TIMEZONES.JST);

      cy.axeCheck();
    });

    it('should display notification with date/time but NO timezone note for UTC', () => {
      setupAndSubmitFiles(TIMEZONES.UTC.offset);

      verifyUploadNotificationHeading();
      verifyUploadTimezoneNote(null);

      cy.axeCheck();
    });
  });
});
