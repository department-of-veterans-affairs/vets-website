import { mockFeatureToggles } from '../../support/helpers/mocks';
import { setupClaimTest } from '../../support/helpers/setup';
import {
  verifyNeedHelp,
  verifyTitleBreadcrumbsHeading,
} from '../../support/helpers/assertions';
import {
  createBenefitsClaim,
  createTrackedItem,
} from '../../support/fixtures/benefitsClaims';

const NEEDED_FROM_YOU_PATH = 'needed-from-you/123456';
const NEEDED_FROM_OTHERS_PATH = 'needed-from-others/123456';

describe('Claim document request', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  describe('First-party evidence requests', () => {
    it('should display friendly headings and default next steps', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          trackedItems: [createTrackedItem()],
        }),
        path: NEEDED_FROM_YOU_PATH,
      });

      verifyTitleBreadcrumbsHeading({
        title: 'Medical records | Veterans Affairs',
        thirdBreadcrumb: {
          name: 'Medical records',
          href: '#content',
        },
        heading: {
          name: 'Medical records Respond by January 1, 2050',
          level: 1,
        },
      });
      cy.findByRole('heading', { name: 'What we need from you', level: 2 });
      cy.findByRole('heading', { name: 'Next steps', level: 2 });
      cy.findByRole('heading', { name: 'Upload documents', level: 2 });

      cy.axeCheck();
    });

    it('should display empty state when no description is available', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          trackedItems: [
            createTrackedItem({
              displayName: 'Unknown Request Type', // Not in evidenceDictionary
              description: '', // No API description either
            }),
          ],
        }),
        path: NEEDED_FROM_YOU_PATH,
      });

      cy.findByText(/We’re unable to provide more information/);
      cy.findByText(/listed in the claim letter/);

      cy.axeCheck();
    });
  });

  describe('Third-party evidence requests', () => {
    it('should display notification headings and optional upload notice', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          trackedItems: [createTrackedItem({ status: 'NEEDED_FROM_OTHERS' })],
        }),
        path: NEEDED_FROM_OTHERS_PATH,
      });

      cy.findByText('Your medical records');
      cy.findByRole('heading', {
        name: 'What we’re notifying you about',
        level: 2,
      });
      cy.findByText('This is just a notice. No action is needed by you.');
      cy.findByRole('heading', {
        name: 'Upload documents',
        level: 2,
      });

      cy.axeCheck();
    });
  });

  describe('VA Need Help section', () => {
    it('should display support aliases', () => {
      setupClaimTest({
        claim: createBenefitsClaim(),
        path: NEEDED_FROM_OTHERS_PATH,
      });

      verifyNeedHelp();

      cy.get('va-need-help')
        .contains(
          'The VA benefits hotline may refer to the “disability exam for hearing” request as “DBQ AUDIO Hearing Loss and Tinnitus”, “Hearing Exam” or “Audio Exam.”',
        )
        .should('be.visible');

      cy.axeCheck();
    });
  });
});
