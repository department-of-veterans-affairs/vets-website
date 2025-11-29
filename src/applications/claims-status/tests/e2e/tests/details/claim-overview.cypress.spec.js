import {
  mockBaseEndpoints,
  verifyTitleBreadcrumbsHeading,
} from '../../support/helpers';
import { createClaim } from '../../support/fixtures';

describe('Claim overview', () => {
  beforeEach(() => {
    mockBaseEndpoints();

    cy.login();

    cy.setupClaimTest({ claim: createClaim(), tab: 'overview' });
  });

  it('should have correct page title, breadcrumbs, and heading', () => {
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

  it('should have svg titles for desktop and mobile', () => {
    // There are 2 titles (1 for desktop and 1 for mobile)
    cy.findAllByText(
      'Your current step is 3 of 8 in the claims process. Steps 3 through 6 can be repeated.',
    ).should('have.length', 2);

    cy.axeCheck();
  });

  it('should display accordion with header, content, and links for each step', () => {
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
          'Your claim is in this step as of January 2, 2025.Step may repeat if we need more information.We’ll review your claim and make sure we have all the evidence and information we need. If we need more evidence to decide your claim, we may gather it in these ways:Ask you to submit evidence Ask you to have a claim examLearn more about VA claim examsRequest medical records from your private health care providerGather evidence from our VA recordsThis is usually the longest step in the process.Note: You can submit evidence at any time. But if you submit evidence after this step, your claim will go back to this step for review.Upload your evidence here',
        links: [
          {
            text: 'Learn more about VA claim exams',
            href: '/disability/va-claim-exam/',
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
      cy.get('@accordion-item')
        .shadow()
        .findByText(step.header);

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
          cy.get('@accordion-item')
            .findByText(link.text)
            .should('have.attr', 'href', link.href);
        });
      }
    });

    cy.axeCheck();
  });
});
