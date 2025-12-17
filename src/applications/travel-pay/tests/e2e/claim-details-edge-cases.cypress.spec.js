/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} -- Claim Details Edge Cases`, () => {
  beforeEach(() => {
    cy.clock(new Date(2024, 5, 25), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withSmocOnly();
    ApiInitializer.initializeClaims.happyPath();
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  describe('Data edge cases', () => {
    it('handles missing optional fields gracefully', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'minimal-claim-456',
        claimNumber: 'TC0000000000004',
        claimStatus: 'In process',
        appointmentDate: '2024-03-01T09:00:00.000Z',
        facilityName: 'Test VA Medical Center',
        createdOn: '2024-03-02T09:00:00.000Z',
        modifiedOn: '2024-03-02T09:00:00.000Z',
        appointment: { appointmentDateTime: '2024-03-01T09:00:00.000Z' },
        // Missing: documents, totalCostRequested, reimbursementAmount
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-03-01T09:00:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/minimal-claim-456`);
      cy.injectAxeThenAxeCheck();

      // Should still display basic information
      cy.get('h1').should(
        'contain.text',
        'Your travel reimbursement claim for Friday, March 1, 2024',
      );
      cy.get('span[data-testid="claim-details-claim-number"]').should(
        'contain.text',
        'Claim number: TC0000000000004',
      );

      // Amount section should not be shown
      cy.contains('p', 'Amount').should('not.exist');

      // Documents section should not be shown
      cy.get('[data-testid="user-submitted-documents"]').should('not.exist');
    });

    it('handles empty documents array', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'no-docs-claim-789',
        claimNumber: 'TC0000000000005',
        claimStatus: 'Approved for payment',
        appointmentDate: '2024-04-01T13:30:00.000Z',
        facilityName: 'Phoenix VA Medical Center',
        totalCostRequested: 15.0,
        reimbursementAmount: 12.0,
        createdOn: '2024-04-02T13:30:00.000Z',
        modifiedOn: '2024-04-02T13:30:00.000Z',
        appointment: { appointmentDateTime: '2024-04-01T13:30:00.000Z' },
        documents: [], // Empty array
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-04-01T13:30:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/no-docs-claim-789`);

      // Should show claim info but no documents section
      cy.contains('Submitted amount of $15').should('be.visible');
      cy.contains('Reimbursement amount of $12').should('be.visible');
      cy.get('[data-testid="user-submitted-documents"]').should('not.exist');
    });

    it('handles null documents', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'null-docs-claim-101',
        claimNumber: 'TC0000000000006',
        claimStatus: 'Saved',
        appointmentDate: '2024-05-01T16:45:00.000Z',
        facilityName: 'Atlanta VA Medical Center',
        totalCostRequested: 25.0,
        reimbursementAmount: 0,
        createdOn: '2024-05-02T16:45:00.000Z',
        modifiedOn: '2024-05-02T16:45:00.000Z',
        appointment: { appointmentDateTime: '2024-05-01T16:45:00.000Z' },
        documents: null, // Null value
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-05-01T16:45:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/null-docs-claim-101`);

      // Should handle null gracefully without crashing
      cy.contains('Submitted amount of $25').should('be.visible');
      cy.get('[data-testid="user-submitted-documents"]').should('not.exist');
    });

    it('handles very long facility names and claim numbers', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'long-names-claim-202',
        claimNumber: 'TC1234567890123456789012345678901234567890',
        claimStatus: 'Claim submitted',
        appointmentDate: '2024-06-01T11:00:00.000Z',
        facilityName:
          'Very Long Facility Name That Might Cause Display Issues in the User Interface Medical Center',
        totalCostRequested: 50.0,
        reimbursementAmount: 47.0,
        createdOn: '2024-06-02T11:00:00.000Z',
        modifiedOn: '2024-06-02T11:00:00.000Z',
        appointment: { appointmentDateTime: '2024-06-01T11:00:00.000Z' },
        documents: [],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-06-01T11:00:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/long-names-claim-202`);

      // Should display long names without breaking layout
      cy.get('span[data-testid="claim-details-claim-number"]').should(
        'contain.text',
        'TC1234567890123456789012345678901234567890',
      );
      cy.contains(
        'Very Long Facility Name That Might Cause Display Issues',
      ).should('be.visible');
    });

    it('handles special characters in filenames', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'special-chars-claim-303',
        claimNumber: 'TC0000000000007',
        claimStatus: 'In manual review',
        appointmentDate: '2024-07-01T08:15:00.000Z',
        facilityName: 'Houston VA Medical Center',
        totalCostRequested: 35.0,
        reimbursementAmount: 32.0,
        createdOn: '2024-07-02T08:15:00.000Z',
        modifiedOn: '2024-07-02T08:15:00.000Z',
        appointment: { appointmentDateTime: '2024-07-01T08:15:00.000Z' },
        documents: [
          {
            documentId: 'special-char-doc-1',
            filename: 'Receipt & Invoice (2024) - Copy #1.pdf',
            mimetype: 'application/pdf',
          },
          {
            documentId: 'special-char-doc-2',
            filename: 'Mileage Log [Updated] - Version 2.0.xlsx',
            mimetype: 'application/vnd.ms-excel',
          },
        ],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-07-01T08:15:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/special-chars-claim-303`);

      cy.get('[data-testid="user-submitted-documents"]').should(
        'have.length',
        2,
      );
    });
  });

  describe('Status-specific behavior', () => {
    it('displays correct messaging for "On hold" status', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'on-hold-claim-404',
        claimNumber: 'TC0000000000008',
        claimStatus: 'On hold',
        appointmentDate: '2024-08-01T12:30:00.000Z',
        facilityName: 'Portland VA Medical Center',
        totalCostRequested: 40.0,
        reimbursementAmount: 0,
        createdOn: '2024-08-02T12:30:00.000Z',
        modifiedOn: '2024-08-05T09:45:00.000Z',
        appointment: { appointmentDateTime: '2024-08-01T12:30:00.000Z' },
        documents: [],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-08-01T12:30:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/on-hold-claim-404`);

      cy.get('[data-testid="status-definition-text"]').should(
        'contain.text',
        'We need more information to decide your claim',
      );
    });

    it('displays correct messaging for "Appealed" status', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'appealed-claim-505',
        claimNumber: 'TC0000000000009',
        claimStatus: 'Appealed',
        appointmentDate: '2024-09-01T15:00:00.000Z',
        facilityName: 'San Diego VA Medical Center',
        totalCostRequested: 60.0,
        reimbursementAmount: 0,
        createdOn: '2024-09-02T15:00:00.000Z',
        modifiedOn: '2024-09-10T11:20:00.000Z',
        appointment: { appointmentDateTime: '2024-09-01T15:00:00.000Z' },
        documents: [],
      });
      ApiInitializer.initializeAppointment.byDateTime(
        '2024-09-01T15:00:00.000Z',
      );
      cy.login(user);
      cy.visit(`${rootUrl}/claims/appealed-claim-505`);

      cy.get('[data-testid="status-definition-text"]').should(
        'contain.text',
        'reviewing your claim appeal',
      );
    });

    it('displays correct messaging for "Partial payment" status', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'partial-payment-claim-606',
        claimNumber: 'TC0000000000010',
        claimStatus: 'Partial payment',
        appointmentDate: '2024-10-01T10:45:00.000Z',
        facilityName: 'Miami VA Medical Center',
        totalCostRequested: 80.0,
        reimbursementAmount: 45.0,
        createdOn: '2024-10-02T10:45:00.000Z',
        modifiedOn: '2024-10-08T14:30:00.000Z',
        appointment: { appointmentDateTime: '2024-10-01T10:45:00.000Z' },
        documents: [],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-10-01T10:45:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/partial-payment-claim-606`);

      cy.get('[data-testid="status-definition-text"]').should(
        'contain.text',
        'expenses you submitted',
      );

      // Should show the amounts difference explanation
      cy.get(
        'va-additional-info[trigger="Why are my amounts different"]',
      ).should('be.visible');
    });
  });

  describe('Document categorization edge cases', () => {
    it('categorizes rejection letters correctly', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'rejection-letter-claim-707',
        claimNumber: 'TC0000000000011',
        claimStatus: 'Denied',
        appointmentDate: '2024-11-01T13:15:00.000Z',
        facilityName: 'Boston VA Medical Center',
        totalCostRequested: 90.0,
        reimbursementAmount: 0,
        createdOn: '2024-11-02T13:15:00.000Z',
        modifiedOn: '2024-11-05T16:20:00.000Z',
        appointment: { appointmentDateTime: '2024-11-01T13:15:00.000Z' },
        documents: [
          {
            documentId: 'rejection-doc-1',
            filename: 'Rejection Letter - Final Decision.pdf',
            mimetype: 'application/pdf',
          },
          {
            documentId: 'user-doc-1',
            filename: 'my-receipt.pdf',
            mimetype: 'application/pdf',
          },
        ],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-11-01T13:15:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/rejection-letter-claim-707`);

      // Should have documents rendered
      cy.get('[data-testid="user-submitted-documents"]').should('exist');

      // Check that at least the user document is visible
      cy.contains('my-receipt.pdf').should('be.visible');

      // Should show appeal section for denied claim
      cy.contains('h2', 'Appealing a claim decision').should('be.visible');
    });

    it('handles mixed document types correctly', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'mixed-docs-claim-808',
        claimNumber: 'TC0000000000012',
        claimStatus: 'Denied',
        appointmentDate: '2024-12-01T09:30:00.000Z',
        facilityName: 'Chicago VA Medical Center',
        totalCostRequested: 100.0,
        reimbursementAmount: 0,
        createdOn: '2024-12-02T09:30:00.000Z',
        modifiedOn: '2024-12-07T12:45:00.000Z',
        appointment: { appointmentDateTime: '2024-12-01T09:30:00.000Z' },
        documents: [
          {
            documentId: 'decision-doc',
            filename: 'Decision Letter - Travel Claim.pdf',
            mimetype: 'application/pdf',
          },
          {
            documentId: 'form-doc',
            filename: 'VA Form 10-0998 Your Rights to Appeal Our Decision.pdf',
            mimetype: 'application/pdf',
          },
          {
            documentId: 'user-doc-1',
            filename: 'parking-receipt.jpg',
            mimetype: 'image/jpeg',
          },
          {
            documentId: 'user-doc-2',
            filename: 'toll-receipt.png',
            mimetype: 'image/png',
          },
          {
            documentId: 'clerk-note',
            filename: 'internal-note.txt',
            // No mimetype - should be excluded
          },
        ],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-12-01T09:30:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/mixed-docs-claim-808`);

      // Should have documents rendered
      cy.get('[data-testid="user-submitted-documents"]').should('exist');

      // Check that user documents are visible
      cy.contains('parking-receipt.jpg').should('be.visible');
      cy.contains('toll-receipt.png').should('be.visible');

      // Should show appeal section with form download
      cy.contains('h2', 'Appealing a claim decision').should('be.visible');
      cy.get('va-link[text="Get VA Form 10-0998 to download"]').should(
        'be.visible',
      );

      // Clerk note should not be visible (no mimetype)
      cy.contains('internal-note.txt').should('not.exist');
    });
  });

  describe('Date and time formatting', () => {
    it('handles different date formats correctly', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'date-test-claim-909',
        claimNumber: 'TC0000000000013',
        claimStatus: 'Approved for payment',
        appointmentDate: '2024-01-01T00:00:00.000Z', // Midnight UTC
        facilityName: 'Test VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 17.0,
        createdOn: '2024-01-01T23:59:59.999Z', // End of day UTC
        modifiedOn: '2024-01-02T12:00:00.000Z', // Noon UTC
        appointment: { appointmentDateTime: '2024-01-01T00:00:00.000Z' },
        documents: [],
      });

      ApiInitializer.initializeAppointment.byDateTime(
        '2024-01-01T00:00:00.000Z',
      );

      cy.login(user);
      cy.visit(`${rootUrl}/claims/date-test-claim-909`);

      // Should display formatted dates and times
      cy.contains('Monday, January 1, 2024').should('be.visible');
      cy.contains('Submitted on').should('be.visible');
      cy.contains('Updated on').should('be.visible');
    });
  });
});
