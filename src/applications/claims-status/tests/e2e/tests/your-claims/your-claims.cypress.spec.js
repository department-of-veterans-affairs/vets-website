import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';
import {
  verifyNeedHelp,
  verifyTitleBreadcrumbsHeading,
} from '../../support/helpers/assertions';

describe('Your claims', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockClaimsEndpoint();
    mockAppealsEndpoint();
    mockStemEndpoint();

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
  });

  it('should have correct title, breadcrumbs, and heading', () => {
    verifyTitleBreadcrumbsHeading({
      title:
        'Check your claim, decision review, or appeal status | Veterans Affairs',
      secondBreadcrumb: {
        name: 'Check your claims and appeals',
        href: '#content',
      },
      heading: {
        name: 'Check your claim, decision review, or appeal status',
        level: 1,
      },
    });

    cy.axeCheck();
  });

  it('should display the on this page section', () => {
    cy.get('va-on-this-page')
      .shadow()
      .within(() => {
        cy.findByRole('heading', { name: 'On this page' });
        cy.findByRole('link', {
          name: 'Your claims, decision reviews, or appeals',
        }).should('have.attr', 'href', '#your-claims-or-appeals');
        cy.findByRole('link', {
          name: 'Your claim letters',
        }).should('have.attr', 'href', '#your-claim-letters');
        cy.findByRole('link', {
          name: "What if I can't find my claim, decision review, or appeal?",
        }).should('have.attr', 'href', '#what-if-i-dont-see-my-appeal');
        cy.findByRole('link', {
          name: 'Your travel claims',
        }).should('have.attr', 'href', '#your-travel-claims');
        cy.findByRole('link', {
          name: 'Additional services',
        }).should('have.attr', 'href', '#additional-services');
      });

    cy.axeCheck();
  });

  it('should display the card list section heading', () => {
    cy.findByRole('heading', {
      name: 'Your claims, decision reviews, or appeals',
    });

    cy.axeCheck();
  });

  it('should display the card list additional info accordion', () => {
    cy.get('va-additional-info')
      .shadow()
      .findByRole('button', {
        name: 'Find out why we sometimes combine claims',
      });

    cy.findByText(
      'If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.',
    ).should('not.be.visible');

    cy.axeCheck();
  });

  it('should display the card list additional info when clicked', () => {
    cy.get('va-additional-info')
      .shadow()
      .findByRole('button', {
        name: 'Find out why we sometimes combine claims',
      })
      .click();

    cy.findByText(
      'If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.',
    ).should('be.visible');

    cy.axeCheck();
  });

  it('should display the card list no claims message', () => {
    cy.findByRole('heading', {
      name: 'You do not have any submitted claims',
    });

    cy.findByText('This page shows only completed claim applications.');

    cy.axeCheck();
  });

  it('should display the letters section', () => {
    cy.findByRole('heading', {
      name: 'Your claim letters',
    });

    cy.findByRole('link', {
      name: 'Download your VA claim letters',
    }).should('have.attr', 'href', '/track-claims/your-claim-letters');

    cy.findByText(
      'You can download your decision letters online. You can also get other letters related to your claims and appeals.',
    );

    cy.axeCheck();
  });

  it("should display the 'What if I can't find' section", () => {
    cy.findByRole('heading', {
      name: "What if I can't find my claim, decision review, or appeal?",
    });

    cy.findByText(
      'If you recently submitted a claim or requested a Higher Level Review or Board appeal, we might still be processing it. Check back for updates.',
    );

    cy.axeCheck();
  });

  it('should display the travel claims section', () => {
    cy.findByRole('heading', {
      name: 'Your travel claims',
    });

    cy.findByRole('link', {
      name: 'Review and file travel claims',
    }).should('have.attr', 'href', '/my-health/travel-pay/claims');

    cy.findByText(
      'File new claims for travel reimbursement and review the status of all your travel claims.',
    );

    cy.axeCheck();
  });

  it('should display the additional services section', () => {
    cy.findByRole('heading', {
      name: 'Additional services',
    });

    cy.get('va-link[data-testid="change-address-link"]', {
      name: 'Change your address and other contact information',
    }).should('have.attr', 'href', '/change-address/');

    cy.get('va-link[data-testid="change-legal-name-link"]', {
      name: 'Change your legal name on file with VA',
    }).should(
      'have.attr',
      'href',
      '/resources/how-to-change-your-legal-name-on-file-with-va/',
    );

    cy.get('va-link[data-testid="get-help-filing-claim-link"]', {
      name: 'Get help filing your VA claim, decision review, or appeal',
    }).should('have.attr', 'href', '/disability/get-help-filing-claim/');

    cy.axeCheck();
  });

  it('should display the need help section', () => {
    verifyNeedHelp();

    cy.axeCheck();
  });
});
