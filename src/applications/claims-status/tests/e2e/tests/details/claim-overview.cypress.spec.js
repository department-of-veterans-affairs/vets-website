import { mockFeatureToggles } from '../../support/helpers/mocks';
import { setupClaimTest } from '../../support/helpers/setup';
import { verifyTitleBreadcrumbsHeading } from '../../support/helpers/assertions';
import { createBenefitsClaim } from '../../support/fixtures/benefitsClaims';

const OVERVIEW_PATH = 'overview';

describe('Claim overview', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  describe('Disability compensation claim or Pension claim', () => {
    it('should have correct page title, breadcrumbs, heading, and intro for disability compensation claims', () => {
      setupClaimTest({ claim: createBenefitsClaim(), path: OVERVIEW_PATH });

      verifyTitleBreadcrumbsHeading({
        title:
          'Overview of January 1, 2025 Compensation Claim | Veterans Affairs',
        thirdBreadcrumb: {
          name: 'Overview of your compensation claim',
          href: '#content',
        },
        heading: { name: 'Overview of the claim process', level: 2 },
      });

      cy.findByText(
        'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
      );

      cy.axeCheck();
    });

    it('should display correct heading and intro for pension claims', () => {
      setupClaimTest({
        claim: createBenefitsClaim({ claimTypeCode: '190ORGDPNPMC' }),
        path: OVERVIEW_PATH,
      });

      cy.findByRole('heading', {
        level: 2,
        name: 'Veterans Pension benefits claim process',
      });
      cy.findByText(
        'There are 8 steps in the claim process. You may need to repeat steps 3 to 6 if we need more information.',
      );

      cy.axeCheck();
    });

    it('should have svg titles for desktop and mobile', () => {
      setupClaimTest({ claim: createBenefitsClaim(), path: OVERVIEW_PATH });
      // There are 2 titles (1 for desktop and 1 for mobile)
      cy.findAllByText(
        'Your current step is 3 of 8 in the claims process. Steps 3 through 6 can be repeated.',
      ).should('have.length', 2);

      cy.axeCheck();
    });

    it('should display accordion with header, content, and links for each step', () => {
      setupClaimTest({ claim: createBenefitsClaim(), path: OVERVIEW_PATH });
      const steps = [
        {
          header: 'Step 1: Claim received',
          content: 'We started working on your claim on January 1, 2025',
        },
        {
          header: 'Step 2: Initial review',
          content:
            'We’ll check your claim for basic information we need, like your name and Social Security number.If information is missing, we’ll contact you.',
        },
        {
          header: 'Step 3: Evidence gathering',
          isCurrentStep: true,
          content:
            'Your claim is in this step as of January 2, 2025.Step may repeat if we need more information.We’ll review your claim and make sure we have all the evidence and information we need. If we need more evidence to decide your claim, we may gather it in these ways:Ask you to submit evidence Ask you to have a claim examRequest medical records from your private health care providerGather evidence from our VA recordsThis is usually the longest step in the process.Note: You can submit evidence at any time. But if you submit evidence after this step, your claim will go back to this step for review.Upload your evidence here',
          links: [
            {
              text: 'Learn more about VA claim exams',
              href: '/disability/va-claim-exam/',
              isVaLink: true,
            },
            {
              text: 'Upload your evidence here',
              href: '/track-claims/your-claims/123456789/files',
            },
          ],
        },
        {
          header: 'Step 4: Evidence review',
          content:
            'Step may repeat if we need more information.We’ll review all the evidence for your claim.If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
        },
        {
          header: 'Step 5: Rating',
          content:
            'Step may repeat if we need more information.We’ll decide your claim and determine your disability rating.If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
        },
        {
          header: 'Step 6: Preparing decision letter',
          content:
            'Step may repeat if we need more information.We’ll prepare your decision letter.If you’re eligible for disability benefits, this letter will include your disability rating, the amount of your monthly payments, and the date your payments will start.If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
        },
        {
          header: 'Step 7: Final review',
          content:
            'A senior reviewer will do a final review of your claim and the decision letter.',
        },
        {
          header: 'Step 8: Claim decided',
          content:
            'You’ll be able to view and download your decision letter on the status page for this claim.Go to the claim letters pageWe’ll also send you a copy of your decision letter by mail. It should arrive within 10 business days, but it may take longer.',
          links: [
            {
              text: 'Go to the claim letters page',
              href: '/track-claims/your-claim-letters',
            },
          ],
        },
      ];

      steps.forEach((step, index) => {
        cy.get('va-accordion')
          .find('va-accordion-item')
          .eq(index)
          .as('accordion-item');

        // Verify the header
        cy.get('@accordion-item').shadow().findByText(step.header);

        // Verify that the accordion is expanded only if it is the current step
        cy.get('@accordion-item')
          .shadow()
          .within(() => {
            cy.get('button').then($button => {
              if (step.isCurrentStep) {
                cy.wrap($button).should('have.attr', 'aria-expanded', 'true');
              } else {
                cy.wrap($button).should('have.attr', 'aria-expanded', 'false');
                cy.wrap($button).click({ force: true });
              }
            });
          });

        // Verify the content
        cy.get('@accordion-item').should('have.text', step.content);

        // Verify the links
        if (step.links) {
          step.links.forEach(link => {
            if (link.isVaLink) {
              cy.get(`va-link[href="${link.href}"]`)
                .should('be.visible')
                .shadow()
                .should('have.text', link.text);
            } else {
              cy.get('@accordion-item')
                .findByText(link.text)
                .should('have.attr', 'href', link.href);
            }
          });
        }
      });

      cy.axeCheck();
    });
  });

  describe('All other claims', () => {
    it('should display correct heading and intro for non-disability compensation or pension claim types', () => {
      setupClaimTest({
        claim: createBenefitsClaim({ claimTypeCode: '400PREDSCHRG' }),
        path: OVERVIEW_PATH,
      });

      cy.findByRole('heading', {
        level: 2,
        name: 'Overview of the claim process',
      });
      cy.findByText(
        'Learn about the VA claim process and what happens after you file your claim.',
      );

      cy.axeCheck();
    });

    it('should display process list with header and content for each step', () => {
      setupClaimTest({
        claim: createBenefitsClaim({ claimTypeCode: '400PREDSCHRG' }),
        path: OVERVIEW_PATH,
      });

      const steps = [
        {
          header: 'Claim received',
          content: ['We received your claim in our system.'],
        },
        {
          header: 'Initial review',
          content: [
            'We’ll check your claim for basic information we need, like your name and Social Security number.',
            'If information is missing, we’ll contact you.',
          ],
        },
        {
          header: 'Evidence gathering, review, and decision',
          isCurrentStep: true,
          content: [
            'If we need more information, we’ll request it from you, health care providers, governmental agencies, or others. Once we have all the information we need, we’ll review it and send your claim to the rating specialist for a decision. There may be times when a claim moves forward to “Preparation for notification” and then briefly back to this stage for more processing.',
          ],
        },
        {
          header: 'Preparation for notification',
          content: [
            'We are preparing your claim decision packet to be mailed.',
          ],
        },
        {
          header: 'Complete',
          content: [
            'Your claim has been completed and you will receive a letter detailing the outcome of your claim.',
          ],
        },
      ];

      steps.forEach((step, index) => {
        cy.get('va-process-list')
          .find('va-process-list-item')
          .eq(index)
          .as('process-list-item');

        // Verify the header
        cy.get('@process-list-item').should('have.attr', 'header', step.header);

        // Verify active state for current step
        if (step.isCurrentStep) {
          cy.get('@process-list-item').should('have.attr', 'active', 'true');
        }

        // Verify the content paragraphs (using find('p') to target slotted content only)
        step.content.forEach((text, pIndex) => {
          cy.get('@process-list-item')
            .find('p')
            .eq(pIndex)
            .should('have.text', text);
        });
      });

      cy.axeCheck();
    });

    it('should display phase back warning when claim moved back to phase 6', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          claimTypeCode: '400PREDSCHRG',
          latestPhaseType: 'PENDING_DECISION_APPROVAL',
          currentPhaseBack: true,
        }),
        path: OVERVIEW_PATH,
      });

      cy.get('[data-testid="phase-back-warning"]').should('be.visible');

      cy.findByText(
        'Your claim was temporarily moved back to this step for further processing.',
      );

      cy.axeCheck();
    });
  });

  context('when claim is closed', () => {
    it('should display Step 8 as current step', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          status: 'COMPLETE',
          closeDate: '2025-01-15',
          latestPhaseType: 'COMPLETE',
        }),
        path: OVERVIEW_PATH,
      });

      // Verify Step 8 accordion is expanded (current step)
      cy.get('va-accordion')
        .find('va-accordion-item')
        .eq(7)
        .shadow()
        .find('button')
        .should('have.attr', 'aria-expanded', 'true');

      cy.axeCheck();
    });
  });
});
