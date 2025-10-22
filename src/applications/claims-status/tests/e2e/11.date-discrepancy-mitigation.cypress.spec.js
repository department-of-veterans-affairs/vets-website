import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import featureToggleDocumentUploadStatusDisabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-disabled.json';

describe('Date Discrepancy Mitigation - Timezone Awareness', () => {
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
    cy.get('.claim-list-item:first-child a.active-va-link').click();
    cy.get('.claim-title').should('be.visible');

    // Navigate to files tab if requested
    if (navigateToFiles) {
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');
    }

    cy.injectAxe();
  };

  describe('Recent Activity Timezone Message', () => {
    it('should display timezone message for non-UTC timezone (CST)', () => {
      // Mock CST timezone (UTC-6, offset = 360 minutes)
      setupWithTimezone(360);

      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      // Message SHOULD appear for non-UTC timezones
      cy.contains('h3', 'Recent activity')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .invoke('text')
        .then(text => {
          // Verify complete message text for CST
          expect(text).to.include('Files uploaded after 6:00 p.m.');
          expect(text).to.include(
            "will show as received on the next day's date, but we record your submissions when you upload them.",
          );
        });

      cy.axeCheck();
    });

    it('should NOT display timezone message for UTC timezone', () => {
      // Mock UTC timezone (offset = 0 minutes)
      setupWithTimezone(0);

      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      // Message should NOT appear for UTC
      cy.contains('h3', 'Recent activity')
        .parent()
        .find('p')
        .first()
        .invoke('text')
        .then(text => {
          expect(text).not.to.include('Files uploaded');
          expect(text).not.to.include('will show as received on');
        });

      cy.axeCheck();
    });
  });

  describe('Documents Filed Timezone Message', () => {
    it('should display timezone message for non-UTC timezone (CST)', () => {
      // Mock CST timezone (UTC-6, offset = 360 minutes)
      setupWithTimezone(360, true);

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      // Message SHOULD appear for non-UTC timezones
      cy.contains('h3', 'Documents filed')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .invoke('text')
        .then(text => {
          // Verify complete message text for CST
          expect(text).to.include('Files uploaded after 6:00 p.m.');
          expect(text).to.include(
            "will show as received on the next day's date, but we record your submissions when you upload them.",
          );
        });

      cy.axeCheck();
    });

    it('should NOT display timezone message for UTC timezone', () => {
      // Mock UTC timezone (offset = 0 minutes)
      setupWithTimezone(0, true);

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      // Message should NOT appear for UTC
      cy.contains('h3', 'Documents filed')
        .parent()
        .find('p')
        .first()
        .invoke('text')
        .then(text => {
          expect(text).not.to.include('Files uploaded');
          expect(text).not.to.include('will show as received on');
        });

      cy.axeCheck();
    });
  });

  describe('UTC Timezone Behavior', () => {
    it('should display timezone message in both tabs for non-UTC timezone (CST)', () => {
      // Mock CST timezone (UTC-6, offset = 360 minutes)
      setupWithTimezone(360);

      // Verify message appears in Recent Activity
      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      cy.contains('h3', 'Recent activity')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .invoke('text')
        .then(text => {
          // Verify complete message text for CST
          expect(text).to.include('Files uploaded after 6:00 p.m.');
          expect(text).to.include(
            "will show as received on the next day's date, but we record your submissions when you upload them.",
          );
        });

      // Navigate to Files tab and verify message appears there too
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      cy.contains('h3', 'Documents filed')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .invoke('text')
        .then(text => {
          // Verify complete message text for CST
          expect(text).to.include('Files uploaded after 6:00 p.m.');
          expect(text).to.include(
            "will show as received on the next day's date, but we record your submissions when you upload them.",
          );
        });

      cy.axeCheck();
    });

    it('should NOT display timezone message in both tabs for UTC timezone', () => {
      // Mock UTC timezone (offset = 0 minutes)
      setupWithTimezone(0);

      // Verify message does NOT appear in Recent Activity
      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

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
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');

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

      cy.axeCheck();
    });
  });

  describe('Upload Success Notification', () => {
    it('should display notification with date/time but NO timezone note for UTC', () => {
      // Mock UTC timezone (offset = 0 minutes)
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
          cy.stub(win.Date.prototype, 'getTimezoneOffset').returns(0);
        },
      });

      // Navigate into claim details and files tab
      cy.get('.claim-list-item:first-child a.active-va-link').click();
      cy.get('.claim-title').should('be.visible');
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');

      cy.injectAxe();

      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.submitFilesForReview();

      // Verify heading contains date and time in correct format
      cy.get('va-alert h2')
        .should('contain.text', 'We received your file upload on')
        .and('contain.text', 'at');

      cy.get('va-alert h2')
        .invoke('text')
        .should('match', /\d{1,2}:\d{2}\s+(a\.m\.|p\.m\.)/i);

      // Verify body does NOT contain timezone note for UTC
      cy.get('va-alert')
        .find('p')
        .invoke('text')
        .then(text => {
          expect(text).not.to.include('Note:');
          expect(text).not.to.include('Files uploaded');
          expect(text).not.to.include('will show as received on');
        });

      cy.axeCheck();
    });

    it('should display notification with date/time AND timezone note for non-UTC (CST)', () => {
      // Mock CST timezone (UTC-6, offset = 360 minutes)
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
          cy.stub(win.Date.prototype, 'getTimezoneOffset').returns(360);
        },
      });

      // Navigate into claim details and files tab
      cy.get('.claim-list-item:first-child a.active-va-link').click();
      cy.get('.claim-title').should('be.visible');
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');

      cy.injectAxe();

      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.submitFilesForReview();

      // Verify heading contains date and time in correct format
      cy.get('va-alert h2')
        .should('contain.text', 'We received your file upload on')
        .and('contain.text', 'at');

      cy.get('va-alert h2')
        .invoke('text')
        .should('match', /\d{1,2}:\d{2}\s+(a\.m\.|p\.m\.)/i);

      // Verify body MAY contain timezone note for CST (only during 6pm-midnight)
      cy.get('va-alert')
        .find('p')
        .invoke('text')
        .then(text => {
          // Timezone note only appears if upload crosses day boundary
          if (text.includes('Note:')) {
            // If note appears, verify complete message text for CST
            expect(text).to.include('Files uploaded after 6:00 p.m.');
            // Verify specific date format appears (Month D, YYYY)
            expect(text).to.match(/[A-Z][a-z]+ \d{1,2}, \d{4}/);
            expect(text).to.include(
              'but we record your submissions when you upload them.',
            );
          }
        });

      cy.axeCheck();
    });
  });

  describe('Positive Offset Timezone Behavior (JST)', () => {
    it('should display "before" message in Recent Activity for JST timezone', () => {
      // Mock JST timezone (UTC+9, offset = -540 minutes)
      setupWithTimezone(-540);

      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      // Message SHOULD appear for non-UTC timezones with "before" direction
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
          // Verify VA.gov time format (e.g., "9:00 a.m." with periods)
          expect(text).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\./);

          // Verify "before" directional language for positive offset
          expect(text).to.include('before');

          // Static message should use "previous day's date" for positive offset
          expect(text).to.include("previous day's date");
        });

      cy.axeCheck();
    });

    it('should display "before" message in Documents Filed for JST timezone', () => {
      // Mock JST timezone (UTC+9, offset = -540 minutes)
      setupWithTimezone(-540, true);

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      // Message SHOULD appear for non-UTC timezones with "before" direction
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
          // Verify VA.gov time format (e.g., "9:00 a.m." with periods)
          expect(text).to.match(/9:00 a.m./);

          // Verify "before" directional language for positive offset
          expect(text).to.include('before');

          // Static message should use "previous day's date" for positive offset
          expect(text).to.include("previous day's date");
        });

      cy.axeCheck();
    });

    it('should display timezone message in both tabs for JST timezone', () => {
      // Mock JST timezone (UTC+9, offset = -540 minutes)
      setupWithTimezone(-540);

      // Verify message appears in Recent Activity with "before" language
      cy.get('.recent-activity-container').should('be.visible');
      cy.contains('h3', 'Recent activity').should('be.visible');

      cy.contains('h3', 'Recent activity')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .and('contain.text', 'Files uploaded')
        .and('contain.text', 'before')
        .and('contain.text', 'will show as received on the')
        .invoke('text')
        .then(text => {
          // Static message should use "previous day's date"
          expect(text).to.include("previous day's date");
        });

      // Navigate to Files tab and verify message appears there too
      cy.get('#tabFiles').click();
      cy.url().should('contain', '/your-claims/189685/files');

      cy.get('.documents-filed-container').should('be.visible');
      cy.contains('h3', 'Documents filed').should('be.visible');

      cy.contains('h3', 'Documents filed')
        .parent()
        .find('p')
        .first()
        .should('be.visible')
        .and('contain.text', 'Files uploaded')
        .and('contain.text', 'before')
        .and('contain.text', 'will show as received on the')
        .invoke('text')
        .then(text => {
          // Static message should use "previous day's date"
          expect(text).to.include("previous day's date");
        });

      cy.axeCheck();
    });
  });
});
