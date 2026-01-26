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

  describe('Description formatting', () => {
    const setupFormattedDescriptionTest = description => {
      setupClaimTest({
        claim: createBenefitsClaim({
          trackedItems: [
            {
              id: 123456,
              displayName: 'Test Request',
              status: 'NEEDED_FROM_YOU',
              requestedDate: '2025-12-01',
              suspenseDate: '2050-01-01',
              description,
              canUploadFile: true,
            },
          ],
        }),
        path: NEEDED_FROM_YOU_PATH,
      });

      // Wait for the page to load
      cy.url().should('include', NEEDED_FROM_YOU_PATH);
      cy.get('h1').should('be.visible');
      // Wait for the api-description element to be present
      cy.get('[data-testid="api-description"]').should('exist');
    };

    it('should render newline characters as new paragraphs', () => {
      setupFormattedDescriptionTest('Line one\nLine two\nLine three');

      cy.get('[data-testid="api-description"]').should('exist');
      cy.get('[data-testid="api-description"] p').should('have.length', 3);
      cy.get('[data-testid="api-description"] p')
        .eq(0)
        .should('have.text', 'Line one');
      cy.get('[data-testid="api-description"] p')
        .eq(1)
        .should('have.text', 'Line two');
      cy.get('[data-testid="api-description"] p')
        .eq(2)
        .should('have.text', 'Line three');

      cy.axeCheck();
    });

    it('should render {b}...{/b} tags as bold text', () => {
      setupFormattedDescriptionTest('This is {b}important{/b} text');

      cy.get('[data-testid="api-description"]').should('exist');
      cy.get('[data-testid="api-description"] strong')
        .should('exist')
        .and('have.text', 'important');

      cy.axeCheck();
    });

    it('should render [*] markers as unordered list items', () => {
      setupFormattedDescriptionTest(
        '[*] First item\n[*] Second item\n[*] Third item',
      );

      cy.get('[data-testid="api-description"]').should('exist');
      cy.get('[data-testid="api-description"] ul').should('exist');
      cy.get('[data-testid="api-description"] ul li').should('have.length', 3);
      cy.get('[data-testid="api-description"] ul li')
        .eq(0)
        .should('have.text', 'First item');
      cy.get('[data-testid="api-description"] ul li')
        .eq(1)
        .should('have.text', 'Second item');
      cy.get('[data-testid="api-description"] ul li')
        .eq(2)
        .should('have.text', 'Third item');

      cy.axeCheck();
    });

    it('should render {*} markers as unordered list items', () => {
      setupFormattedDescriptionTest('{*} Item A\n{*} Item B');

      cy.get('[data-testid="api-description"]').should('exist');
      cy.get('[data-testid="api-description"] ul').should('exist');
      cy.get('[data-testid="api-description"] ul li').should('have.length', 2);

      cy.axeCheck();
    });

    it('should render inline list markers without preceding newlines', () => {
      setupFormattedDescriptionTest(
        'Required documents:{*} First item{*} Second item{*} Third item',
      );

      cy.get('[data-testid="api-description"]').should('exist');
      cy.get('[data-testid="api-description"] p').should(
        'contain.text',
        'Required documents:',
      );
      cy.get('[data-testid="api-description"] ul').should('exist');
      cy.get('[data-testid="api-description"] ul li').should('have.length', 3);
      cy.get('[data-testid="api-description"] ul li')
        .eq(0)
        .should('have.text', 'First item');
      cy.get('[data-testid="api-description"] ul li')
        .eq(1)
        .should('have.text', 'Second item');
      cy.get('[data-testid="api-description"] ul li')
        .eq(2)
        .should('have.text', 'Third item');

      cy.axeCheck();
    });

    it('should render combined formatting correctly', () => {
      setupFormattedDescriptionTest(
        '{b}Important:{/b} Please provide the following:\n[*] {b}Document A{/b}\n[*] Document B',
      );

      cy.get('[data-testid="api-description"]').should('exist');

      // Check bold text in paragraph
      cy.get('[data-testid="api-description"] p strong')
        .should('exist')
        .and('have.text', 'Important:');

      // Check list exists
      cy.get('[data-testid="api-description"] ul').should('exist');
      cy.get('[data-testid="api-description"] ul li').should('have.length', 2);

      // Check bold text in list item
      cy.get('[data-testid="api-description"] ul li')
        .eq(0)
        .find('strong')
        .should('have.text', 'Document A');

      cy.axeCheck();
    });
  });
});
