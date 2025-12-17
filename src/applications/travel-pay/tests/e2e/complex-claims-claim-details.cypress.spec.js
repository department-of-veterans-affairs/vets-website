/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} -- Complex Claims Claim Details`, () => {
  beforeEach(() => {
    cy.clock(new Date(2024, 5, 25), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  describe('Complex claims specific features', () => {
    beforeEach(() => {
      ApiInitializer.initializeClaimDetails.happyPath();
      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
      cy.wait('@details');
      cy.injectAxeThenAxeCheck();
    });

    it('displays "Created on" instead of "Submitted on" with complex claims enabled', () => {
      cy.contains('h2', 'Claim information').should('be.visible');

      // Should show "Created on" when complex claims toggle is enabled
      cy.contains('Created on').should('be.visible');
      cy.contains('March 12, 2025').should('be.visible');
      cy.contains('Updated on').should('be.visible');

      // Should not show "Submitted on"
      cy.contains('Submitted on').should('not.exist');
    });

    it('displays out of bounds appointment alert for out of bounds claims', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        isOutOfBounds: true,
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should display the out of bounds alert
      cy.get('va-alert[status="warning"]').should('be.visible');
      cy.contains('Your appointment happened more than 30 days ago').should(
        'be.visible',
      );
    });

    it('does not display out of bounds alert when isOutOfBounds is false', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        isOutOfBounds: false,
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should not display the out of bounds alert
      cy.get('va-alert[status="warning"]').should('not.exist');
      cy.contains('Your appointment happened more than 30 days ago').should(
        'not.exist',
      );
    });

    it('displays "Complete and file your claim in BTSSS" link for Incomplete status when claim started in BTSSS', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        claimSource: 'Api',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should show the complete and file link
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );
      cy.get('va-link[text="Complete and file your claim in BTSSS"]')
        .should(
          'have.attr',
          'href',
          'https://dvagov-btsss.dynamics365portals.us/',
        )
        .should('have.attr', 'external');
    });

    it('displays "Complete and file your claim in BTSSS" link for Saved status when claim started in BTSSS', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        claimSource: 'Api',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should show the complete and file link
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );
      cy.get('va-link[text="Complete and file your claim in BTSSS"]')
        .should(
          'have.attr',
          'href',
          'https://dvagov-btsss.dynamics365portals.us/',
        )
        .should('have.attr', 'external');
    });

    it('displays "Complete and file your claim in BTSSS" link for Saved status when there are unassociated docs', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [
          {
            documentId: 'doc-unassociated-123',
            filename: 'receipt.pdf',
            mimetype: 'application/pdf',
            createdon: '2025-03-12T20:27:14.088Z',
            // No expenseId, doc is unassociated
          },
        ],
        claimSource: 'VaGov',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should show the complete and file link even though started on VaGov
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );
      cy.get('va-link[text="Complete and file your claim in BTSSS"]')
        .should(
          'have.attr',
          'href',
          'https://dvagov-btsss.dynamics365portals.us/',
        )
        .should('have.attr', 'external');
    });

    it('displays "Complete and file your claim in BTSSS" link for Incomplete status when there are unassociated docs', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [
          {
            documentId: 'doc-orphan-456',
            filename: 'parking-receipt.jpg',
            mimetype: 'image/jpeg',
            createdon: '2025-03-12T20:27:14.088Z',
            // No expenseId, doc is unassociated
          },
        ],
        claimSource: 'VaGov',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should show the complete and file link even though started on VaGov
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );
      cy.get('va-link[text="Complete and file your claim in BTSSS"]')
        .should(
          'have.attr',
          'href',
          'https://dvagov-btsss.dynamics365portals.us/',
        )
        .should('have.attr', 'external');
    });

    it('does not display "Complete and file your claim in BTSSS" link for other statuses', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Approved for payment',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 14.52,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        claimSource: 'VaGov',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should not show the complete and file link for approved claims
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'not.exist',
      );
    });

    it('displays alternative status definitions when available', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should display alternative definition for Incomplete status when complex claims is enabled
      cy.get('[data-testid="status-definition-text"]').should('be.visible');
      // The alternative definition should be shown (if it exists in constants)
    });

    it('displays note text when there are unassociated docs (Saved status)', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [
          {
            documentId: 'doc-note-test-123',
            filename: 'receipt.pdf',
            mimetype: 'application/pdf',
            createdon: '2025-03-12T20:27:14.088Z',
          },
        ],
        claimSource: 'VaGov',
        expenses: [], // Unassociated doc
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should display the note text
      cy.contains('Note:').should('be.visible');
      cy.contains(
        "We can't file your travel reimbursement claim here right now",
      ).should('be.visible');
      cy.contains(
        'you can still file your claim in the Beneficiary Travel Self Service System (BTSSS)',
      ).should('be.visible');
    });

    it('displays note text when the claim started in BTSSS', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 14.52,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [],
        claimSource: 'Api',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains('Note:').should('be.visible');
      cy.contains(
        "We can't file your travel reimbursement claim here right now",
      ).should('be.visible');
    });

    it('does not display note text when all docs are associated', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [
          {
            documentId: 'doc-associated',
            filename: 'toll-receipt.pdf',
            mimetype: 'application/pdf',
            createdon: '2025-03-12T20:27:14.088Z',
            expenseId: 'expense-toll', // Doc is associated with expense
          },
        ],
        claimSource: 'VaGov',
        expenses: [
          {
            id: 'expense-toll',
            expenseType: 'Toll',
            costRequested: 5.0,
          },
        ],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should NOT display the note text
      cy.contains('Note:').should('not.exist');
      cy.contains(
        "We can't file your travel reimbursement claim here right now",
      ).should('not.exist');
    });

    it('does NOT display note text when only clerk notes exist (no mimetype)', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Approved for payment',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 14.52,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: { id: '73611905-71bf-46ed-b1ec-e790593b8565' },
        documents: [
          {
            documentId: 'clerk-note-1',
            filename: 'Internal Note 1.txt',
            mimetype: '', // Empty mimetype = clerk note
            createdon: '2025-03-12T20:27:14.088Z',
          },
          {
            documentId: 'clerk-note-2',
            filename: 'Internal Note 2.txt',
            mimetype: '', // Empty mimetype = clerk note
            createdon: '2025-03-12T20:27:14.088Z',
          },
        ],
        claimSource: 'VaGov',
        expenses: [],
      });

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should NOT display note text - clerk notes are filtered out
      cy.contains('Note:').should('not.exist');
      cy.contains(
        "We can't file your travel reimbursement claim here right now",
      ).should('not.exist');
    });
  });

  describe('VA.gov link display (requires appointment API)', () => {
    // These tests need appointment API mocked but shouldn't use the parent beforeEach
    // because it causes Redux state to persist between visits
    beforeEach(() => {
      cy.login(user);
    });

    it('does NOT display "Complete and file your claim in BTSSS" link when all docs are associated', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          id: '73611905-71bf-46ed-b1ec-e790593b8565',
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [
          {
            documentId: 'doc-associated-789',
            filename: 'parking-receipt.pdf',
            mimetype: 'application/pdf',
            createdon: '2025-03-12T20:27:14.088Z',
            expenseId: 'expense-123', // Doc is associated with expense
          },
        ],
        claimSource: 'VaGov',
        expenses: [
          {
            id: 'expense-123',
            expenseType: 'Parking',
            costRequested: 20.0,
          },
        ],
      });

      // Initialize appointment API so appointmentId is available
      ApiInitializer.initializeAppointment.byDateTime(
        '2024-01-01T16:45:34.465Z',
      );

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
      cy.wait('@appointmentsByDate'); // Wait for appointment API to be called

      // Should NOT show the BTSSS link - all docs are associated, claim started on VaGov
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'not.exist',
      );

      // Should show the VA.gov link instead
      cy.get('va-link-action[text="Complete and file your claim"]').should(
        'be.visible',
      );
    });

    it('does NOT display BTSSS link when only clerk notes exist (no mimetype)', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Saved',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        appointment: {
          id: '73611905-71bf-46ed-b1ec-e790593b8565',
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [
          {
            documentId: 'clerk-note-internal-1',
            filename: 'Internal Clerk Note.txt',
            mimetype: '', // Empty mimetype = clerk note, not user doc
            createdon: '2025-03-12T20:27:14.088Z',
          },
          {
            documentId: 'clerk-note-internal-2',
            filename: 'Another Note.txt',
            mimetype: '', // Another clerk note
            createdon: '2025-03-12T20:27:14.088Z',
          },
        ],
        claimSource: 'VaGov',
        expenses: [],
      }).as('getClaimDetails');

      // Initialize appointment API so appointmentId is available
      ApiInitializer.initializeAppointment.byDateTime(
        '2024-01-01T16:45:34.465Z',
      );

      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
      cy.wait('@getClaimDetails');
      cy.wait('@appointmentsByDate'); // Wait for appointment API to be called

      // Should NOT show BTSSS link - clerk notes should be ignored
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'not.exist',
      );

      // Should show VA.gov link instead since claim started on VaGov
      cy.get('va-link-action[text="Complete and file your claim"]').should(
        'be.visible',
      );
    });
  });

  describe('Date formatting with complex claims', () => {
    it('formats dates correctly with "Created on" label', () => {
      ApiInitializer.initializeClaimDetails.happyPath();
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        claimNumber: 'TC0000000000020',
        claimStatus: 'Saved',
        appointmentDate: '2024-06-15T14:30:00.000Z',
        facilityName: 'Test VA Medical Center',
        totalCostRequested: 30.0,
        reimbursementAmount: 0,
        createdOn: '2024-06-16T10:00:00.000Z',
        modifiedOn: '2024-06-17T15:45:00.000Z',
        appointment: {
          appointmentDateTime: '2024-06-15T14:30:00.000Z',
        },
        documents: [],
      });

      cy.login(user);
      ApiInitializer.initializeAppointment.byDateTime(
        '2024-06-15T14:30:00.000Z',
      );
      cy.visit(`${rootUrl}/claims/a1b2c3d4-e5f6-7890-abcd-ef1234567890`);

      // Should show "Created on" with formatted date
      cy.contains('Created on').should('be.visible');
      cy.contains('Updated on').should('be.visible');

      // Should not show "Submitted on"
      cy.contains('Submitted on').should('not.exist');
    });
  });

  describe('Combined complex claims scenarios', () => {
    it('displays all complex claims features together for Incomplete claim', () => {
      ApiInitializer.initializeClaimDetails.happyPath();
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '12345678-90ab-cdef-1234-567890abcdef',
        claimNumber: 'TC0000000000021',
        claimStatus: 'Incomplete',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Complex Claims VA Medical Center',
        totalCostRequested: 0,
        reimbursementAmount: 0,
        createdOn: '2024-03-02T09:00:00.000Z',
        modifiedOn: '2024-03-02T09:00:00.000Z',
        appointment: {
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
        },
        documents: [],
        isOutOfBounds: true,
      }).as('details');

      cy.login(user);
      ApiInitializer.initializeAppointment.byDateTime(
        '2024-01-01T16:45:34.465Z',
      );
      cy.visit(`${rootUrl}/claims/12345678-90ab-cdef-1234-567890abcdef`);
      cy.wait('@details');
      cy.injectAxeThenAxeCheck();

      // Should show out of bounds alert
      cy.get('va-alert[status="warning"]').should('be.visible');

      // Should show "Created on"
      cy.contains('Created on').should('be.visible');

      // Should show complete and file link
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );

      // Should show status definition
      cy.get('[data-testid="status-definition-text"]').should('be.visible');
    });

    it('displays complex claims features for Saved claim without out of bounds alert', () => {
      // Use a recent date (within 30 days) so calculateIsOutOfBounds returns false
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5); // 5 days ago
      const recentDateString = recentDate.toISOString();

      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'fedcba09-8765-4321-fedc-ba0987654321',
        claimNumber: 'TC0000000000022',
        claimStatus: 'Saved',
        appointmentDate: recentDateString,
        facilityName: 'Test VA Medical Center',
        totalCostRequested: 25.0,
        reimbursementAmount: 0,
        createdOn: '2024-05-01T14:00:00.000Z',
        modifiedOn: '2024-05-01T14:00:00.000Z',
        appointment: {
          appointmentDateTime: recentDateString,
        },
        documents: [],
        isOutOfBounds: false,
      }).as('details');

      ApiInitializer.initializeAppointment.byDateTime(recentDateString);

      cy.login(user);
      cy.visit(`${rootUrl}/claims/fedcba09-8765-4321-fedc-ba0987654321`);
      cy.wait('@details');

      // Should not show out of bounds alert
      cy.get('va-alert[status="warning"]').should('not.exist');

      // Should show "Created on"
      cy.contains('Created on').should('be.visible');

      // Should show complete and file link
      cy.get('va-link[text="Complete and file your claim in BTSSS"]').should(
        'be.visible',
      );

      // Should show submitted amount
      cy.contains('Submitted amount of $25').should('be.visible');
    });
  });
});
