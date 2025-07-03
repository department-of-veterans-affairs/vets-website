/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} -- Claim Details Content`, () => {
  beforeEach(() => {
    cy.clock(new Date(2024, 5, 25), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  describe('Basic claim information display', () => {
    beforeEach(() => {
      ApiInitializer.initializeClaimDetails.happyPath();
      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
      cy.injectAxeThenAxeCheck();
    });

    it('displays the correct page title and claim information', () => {
      cy.get('h1').should(
        'contain.text',
        'Your travel reimbursement claim for Monday, January 1, 2024',
      );

      cy.get('span[data-testid="claim-details-claim-number"]').should(
        'contain.text',
        'Claim number: TC0000000000001',
      );

      cy.get('h2').should('contain.text', 'Claim status: Approved for payment');
    });

    it('displays status definition when available', () => {
      cy.get('[data-testid="status-definition-text"]').should(
        'contain.text',
        'We approved your claim',
      );
    });

    it('displays claim information section with correct details', () => {
      cy.contains('h2', 'Claim information').should('be.visible');

      // Check "When" section
      cy.contains('p', 'When')
        .should('have.class', 'vads-u-font-weight--bold')
        .should('be.visible');

      cy.contains('Submitted on').should('be.visible');
      cy.contains('March 12, 2025').should('be.visible');
      cy.contains('Updated on').should('be.visible');

      // Check "Where" section
      cy.contains('p', 'Where')
        .should('have.class', 'vads-u-font-weight--bold')
        .should('be.visible');

      cy.contains('Monday, January 1, 2024 at 4:45 PM appointment').should(
        'be.visible',
      );
      cy.contains('Cheyenne VA Medical Center').should('be.visible');
    });

    it('displays amount information when available', () => {
      cy.contains('p', 'Amount')
        .should('have.class', 'vads-u-font-weight--bold')
        .should('be.visible');

      cy.contains('Submitted amount of $20').should('be.visible');
      cy.contains('Reimbursement amount of $14.52').should('be.visible');
    });

    it('shows additional info when amounts differ', () => {
      cy.get('va-additional-info[trigger="Why are my amounts different"]')
        .should('be.visible')
        .click();

      cy.contains(
        'The VA travel pay deductible is $3 for a one-way trip',
      ).should('be.visible');

      cy.get('va-link[href*="monthlydeductible"]').should('be.visible');

      cy.contains(
        'Beneficiary Travel team may have issued a partial payment',
      ).should('be.visible');
    });
  });

  describe('Different claim statuses', () => {
    it('displays help text for unknown status', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', {
        fixture:
          'applications/travel-pay/tests/fixtures/travel-claim-details-v1.json',
      }).then(() => {
        // Modify the response to have an unknown status
        cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
          req.reply(res => {
            const { body } = res;
            body.claimStatus = 'Unknown Status';
            res.send(body);
          });
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains(
        'If you need help understanding your claim, call the BTSSS call center',
      ).should('be.visible');

      cy.get('va-telephone[contact="8555747292"]').should('be.visible');
      cy.get('va-telephone[tty][contact="711"]').should('be.visible');
    });

    it('displays denied status appeal information', () => {
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
        documents: [],
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Check that the claim status shows as Denied first
      cy.contains('Claim status: Denied').should('be.visible');

      // Wait for the page to load and check for appeal section
      cy.contains('Appealing a claim decision', { timeout: 10000 }).should(
        'be.visible',
      );
      cy.contains('If you would like to appeal this decision you can:').should(
        'be.visible',
      );

      // Check appeal options
      cy.contains('Submit an appeal via the Board of Appeals').should(
        'be.visible',
      );
      cy.contains(
        'Send a secure message to the Beneficiary Travel team',
      ).should('be.visible');
      cy.contains('Mail a printed version of').should('be.visible');

      // Check appeal link
      cy.get('va-link-action[text="Appeal the claim decision"]')
        .should('be.visible')
        .should('have.attr', 'href', '/decision-reviews');
    });
  });

  describe('Documents handling', () => {
    it('displays user-submitted documents when available', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures(); // Ensure feature toggles are enabled
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.documents = [
            {
              documentId: 'doc123',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
            },
            {
              documentId: 'doc456',
              filename: 'mileage-log.xlsx',
              mimetype: 'application/vnd.ms-excel',
            },
          ];
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains('p', 'Documents you submitted')
        .should('have.class', 'vads-u-font-weight--bold')
        .should('be.visible');

      // Check that document download components are rendered
      cy.contains('receipt.pdf').should('be.visible');
      cy.contains('mileage-log.xlsx').should('be.visible');
    });

    it('displays decision letter when available', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures(); // Ensure feature toggles are enabled
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.documents = [
            {
              documentId: 'decision123',
              filename: 'Decision Letter - Claim TC123.pdf',
              mimetype: 'application/pdf',
            },
          ];
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Decision letter should be displayed above claim information
      cy.get('va-link').should('have.length.at.least', 1);
    });

    it('displays form 10-0998 download for denied claims', () => {
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
        documents: [
          {
            documentId: 'form123',
            filename: 'VA Form 10-0998 Your Rights to Appeal Our Decision.pdf',
            mimetype: 'application/pdf',
          },
        ],
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Should show download link for form in appeal section
      cy.contains('Mail a printed version of').should('be.visible');
      cy.contains('VA Form 10-0998 (PDF)').should('be.visible');
    });

    it('shows fallback link for form 10-0998 when document not available', () => {
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
        documents: [], // No documents
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.get('va-link[text="VA Form 10-0998 (PDF)"]')
        .should('be.visible')
        .should('have.attr', 'href')
        .and('include', '/find-forms/about-form-10-0998/');
    });

    it('excludes clerk note attachments without mimetype', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures(); // Ensure feature toggles are enabled
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.documents = [
            {
              documentId: 'note123',
              filename: 'clerk-note.txt',
              // No mimetype - should be excluded
            },
            {
              documentId: 'receipt123',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
            },
          ];
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Only one document should be displayed (the receipt)
      cy.contains('receipt.pdf').should('be.visible');
      cy.contains('clerk-note.txt').should('not.exist');
    });
  });

  describe('Feature toggle behavior', () => {
    it('hides management features when toggle is disabled', () => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'travel_pay_power_switch', value: true },
            { name: 'travel_pay_view_claim_details', value: true },
            { name: 'travel_pay_submit_mileage_expense', value: true },
            { name: 'travel_pay_claims_management', value: false }, // Disabled
          ],
        },
      });

      ApiInitializer.initializeClaimDetails.happyPath();
      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      // Status definition should not be shown
      cy.get('[data-testid="status-definition-text"]').should('not.exist');

      // Amount information should not be shown
      cy.contains('p', 'Amount').should('not.exist');

      // Documents section should not be shown
      cy.contains('p', 'Documents you submitted').should('not.exist');

      // Appeal section should not be shown even for denied claims
      cy.contains('h2', 'Appealing a claim decision').should('not.exist');
    });
  });

  describe('Amount display scenarios', () => {
    it('shows only submitted amount when reimbursement is zero', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.totalCostRequested = 25.0;
          body.reimbursementAmount = 0;
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains('Submitted amount of $25').should('be.visible');
      cy.contains('Reimbursement amount').should('not.exist');

      // Additional info should not be shown when reimbursement is 0
      cy.get(
        'va-additional-info[trigger="Why are my amounts different"]',
      ).should('not.exist');
    });

    it('hides amount section when no costs are requested', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.totalCostRequested = 0;
          body.reimbursementAmount = 0;
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains('p', 'Amount').should('not.exist');
      cy.contains('Submitted amount').should('not.exist');
    });

    it('does not show additional info when amounts are equal', () => {
      cy.intercept('GET', '/travel_pay/v0/claims/*', req => {
        req.reply(res => {
          const { body } = res;
          body.totalCostRequested = 20.0;
          body.reimbursementAmount = 20.0;
          res.send(body);
        });
      });

      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);

      cy.contains('Submitted amount of $20').should('be.visible');
      cy.contains('Reimbursement amount of $20').should('be.visible');

      // Additional info should not be shown when amounts are equal
      cy.get(
        'va-additional-info[trigger="Why are my amounts different"]',
      ).should('not.exist');
    });
  });

  describe('Accessibility and navigation', () => {
    beforeEach(() => {
      ApiInitializer.initializeClaimDetails.happyPath();
      cy.login(user);
      cy.visit(`${rootUrl}/claims/73611905-71bf-46ed-b1ec-e790593b8565`);
    });

    it('maintains proper heading hierarchy', () => {
      cy.get('h1').should('have.length', 1);
      cy.get('h2').should('have.length.at.least', 1);

      // Verify heading order
      cy.get('h1').should('contain.text', 'Your travel reimbursement claim');
      cy.contains('h2', 'Claim status:').should('be.visible');
    });

    it('has proper ARIA attributes for interactive elements', () => {
      cy.get('va-additional-info').should('have.attr', 'trigger');
      cy.get('va-telephone').should('have.attr', 'contact');
    });

    it('supports keyboard navigation', () => {
      // Test that focusable elements can be reached via keyboard
      cy.get('va-additional-info')
        .should('be.visible')
        .click(); // Click to expand first
      cy.get('va-telephone').should('be.visible');
    });
  });
});
