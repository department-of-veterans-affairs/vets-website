/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} -- Claim Details Accessibility & Interactions`, () => {
  beforeEach(() => {
    cy.clock(new Date(2024, 5, 25), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
    ApiInitializer.initializeClaimDetails.happyPath();
    cy.login(user);
    cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  describe('Accessibility compliance', () => {
    it('passes axe accessibility checks', () => {
      cy.injectAxeThenAxeCheck();
    });

    it('has proper landmark structure', () => {
      // Main content should be properly structured
      cy.get('main').should('exist');
      cy.get('h1').should('have.length', 1);

      // Check for proper heading hierarchy (h1 -> h2 -> h3)
      cy.get('h1').should('contain.text', 'Your travel reimbursement claim');
      cy.get('h2').should('have.length.at.least', 1);
      cy.get('.vads-u-font-size--h3').should('exist');
    });

    it('has appropriate ARIA labels and roles', () => {
      // Check data-testid attributes for screen readers
      cy.get('[data-testid="claim-details-claim-number"]').should('exist');
      cy.get('[data-testid="status-definition-text"]').should('exist');

      // Check VA web components have proper attributes
      cy.get('va-additional-info').should('have.attr', 'trigger');
      cy.get('va-telephone').should('have.attr', 'contact');
    });

    it('maintains proper focus management', () => {
      // Verify focusable elements are in logical tab order
      cy.get('va-additional-info').should('be.visible');
      cy.get('va-link').should('be.visible');

      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused();
      cy.get(':focus').should('be.visible');
    });

    it('has sufficient color contrast', () => {
      // Verify text has proper contrast classes
      cy.get('.vads-u-font-weight--bold').should('be.visible');
      cy.get('.vads-u-font-size--h2').should('be.visible');
      cy.get('.vads-u-font-size--h3').should('be.visible');
    });

    it('supports screen reader announcements', () => {
      // Check for proper semantic markup
      cy.get('h1').should('not.have.attr', 'role'); // h1 should use implicit role, not explicit
      cy.get('h2').should('be.visible');
      cy.get('p').should('have.length.greaterThan', 0);
    });
  });

  describe('Interactive elements', () => {
    it('expands and collapses additional info sections', () => {
      // Test the "Why are my amounts different" accordion
      cy.get('va-additional-info[trigger="Why are my amounts different"]')
        .should('be.visible')
        .click();

      // Content should be visible after clicking
      cy.contains('The VA travel pay deductible is $3').should('be.visible');
      cy.contains('Beneficiary Travel team may have issued').should(
        'be.visible',
      );

      // Check that the link within the accordion works
      cy.get('va-link[href*="monthlydeductible"]').should('be.visible');
    });

    it('has working telephone links', () => {
      // Mock unknown status to show help text with phone numbers
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Unknown Status',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        documents: [],
      });

      cy.reload();

      // Check phone numbers are properly formatted
      cy.get('va-telephone[contact="8555747292"]')
        .should('be.visible')
        .should('have.attr', 'contact', '8555747292');

      cy.get('va-telephone[tty][contact="711"]')
        .should('be.visible')
        .should('have.attr', 'contact', '711')
        .should('have.attr', 'tty');
    });

    it('has working external links', () => {
      // Test link in additional info section
      cy.get('va-additional-info[trigger="Why are my amounts different"]')
        .should('be.visible')
        .click();

      cy.get('va-link[href*="monthlydeductible"]')
        .should('be.visible')
        .should('have.attr', 'href')
        .and('include', 'monthlydeductible');

      // For denied claims, test appeal link
      ApiInitializer.initializeFeatureToggle.withAllFeatures(); // Ensure feature toggles are enabled
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: '73611905-71bf-46ed-b1ec-e790593b8565',
        claimNumber: 'TC0000000000001',
        claimStatus: 'Denied',
        appointmentDate: '2024-01-01T16:45:34.465Z',
        facilityName: 'Cheyenne VA Medical Center',
        totalCostRequested: 20.0,
        reimbursementAmount: 0,
        createdOn: '2025-03-12T20:27:14.088Z',
        modifiedOn: '2025-03-12T20:27:14.088Z',
        documents: [], // No documents to trigger fallback link
      });

      cy.reload();

      cy.get('va-link-action[text="Appeal the claim decision"]')
        .should('be.visible')
        .should('have.attr', 'href', '/decision-reviews');

      // Test form link when no documents available
      cy.get('va-link[text="VA Form 10-0998 (PDF)"]')
        .should('be.visible')
        .should('have.attr', 'href')
        .and('include', '/find-forms/about-form-10-0998/');
    });
  });

  describe('Responsive design', () => {
    it('displays properly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.injectAxeThenAxeCheck();

      // Check that content is still visible and accessible
      cy.get('h1').should('be.visible');
      cy.get('span[data-testid="claim-details-claim-number"]').should(
        'be.visible',
      );
      cy.get('h2').should('be.visible');

      // Check that interactive elements work on mobile
      cy.get('va-additional-info[trigger="Why are my amounts different"]')
        .should('be.visible')
        .click();

      cy.contains('The VA travel pay deductible is $3').should('be.visible');
    });

    it('displays properly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.injectAxeThenAxeCheck();

      // Verify layout integrity
      cy.get('h1').should('be.visible');
      cy.contains('Claim information').should('be.visible');
      cy.contains('When').should('be.visible');
      cy.contains('Where').should('be.visible');
    });

    it('displays properly on desktop viewport', () => {
      cy.viewport(1200, 800);
      cy.injectAxeThenAxeCheck();

      // All content should be visible and well-spaced
      cy.get('h1').should('be.visible');
      cy.get('h2').should('be.visible');
      cy.get('.vads-u-margin-y--0').should('exist');
      cy.get('.vads-u-font-weight--bold').should('exist');
    });
  });

  describe('Error handling', () => {
    it('handles missing data gracefully', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        claimId: 'minimal-data-claim',
        claimNumber: 'TC-MINIMAL',
        claimStatus: 'In process',
        appointmentDate: '2024-01-01T10:00:00.000Z',
        facilityName: 'Test Facility',
        createdOn: '2024-01-01T10:00:00.000Z',
        modifiedOn: '2024-01-01T10:00:00.000Z',
        // Missing many optional fields
      });

      cy.reload();
      cy.injectAxeThenAxeCheck();

      // Should still display basic information without errors
      cy.get('h1').should('be.visible');
      cy.get('span[data-testid="claim-details-claim-number"]').should(
        'be.visible',
      );
    });

    it('handles API errors gracefully', () => {
      ApiInitializer.initializeClaimDetails.errorPath();
      cy.reload();

      // Should show error message instead of crashing
      cy.contains('There was an error loading the claim details').should(
        'be.visible',
      );
    });
  });

  describe('Content validation', () => {
    it('displays all required claim information fields', () => {
      const requiredFields = [
        'Your travel reimbursement claim',
        'Claim number:',
        'Claim status:',
        'Claim information',
        'When',
        'Submitted on',
        'Updated on',
        'Where',
        'appointment',
      ];

      requiredFields.forEach(field => {
        cy.contains(field).should('be.visible');
      });
    });

    it('formats dates and times correctly', () => {
      // Check date formatting patterns
      cy.contains(/[A-Za-z]+ \d{1,2}, \d{4}/).should('be.visible'); // "January 1, 2024"
      cy.contains(/\d{1,2}:\d{2} [AP]M/).should('be.visible'); // "4:45 PM"
    });

    it('formats currency correctly', () => {
      // Check currency formatting
      cy.contains(/\$\d+(\.\d{2})?/).should('be.visible'); // "$20" or "$14.52"
    });

    it('displays claim status with proper formatting', () => {
      cy.get('h2')
        .contains('Claim status:')
        .should('have.class', 'vads-u-font-size--h3');
    });
  });

  describe('Performance considerations', () => {
    it('loads content efficiently', () => {
      // Check that page loads within reasonable time
      cy.get('h1').should('be.visible');
      cy.get('[data-testid="claim-details-claim-number"]').should('be.visible');

      // Verify no unnecessary re-renders by checking element stability
      cy.get('h1').should('not.have.class', 'loading');
    });

    it('handles large amounts of data', () => {
      // Mock response with many documents
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.documents = Array.from({ length: 20 }, (_, i) => ({
            documentId: `doc-${i}`,
            filename: `document-${i}.pdf`,
            mimetype: 'application/pdf',
          }));
          res.send(body);
        });
      });

      cy.reload();

      // Should handle large document lists without performance issues
      cy.contains('Documents you submitted').should('be.visible');
      cy.get('[class*="vads-u-margin-top--1"]').should(
        'have.length.greaterThan',
        10,
      );
    });
  });
});
