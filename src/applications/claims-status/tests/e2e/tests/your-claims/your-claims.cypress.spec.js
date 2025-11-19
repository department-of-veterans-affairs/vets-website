describe('Your claims', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
    cy.intercept('GET', '/v0/benefits_claims', {
      data: [],
    });
    cy.intercept('GET', '/v0/appeals', {
      data: [],
    });
    cy.intercept('GET', '/v0/education_benefits_claims/stem_claim_status', {
      data: {},
    });
    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
  });

  it("should have document title (shown in browser's title bar and a page's tab)", () => {
    cy.title().should(
      'eq',
      'Check your claim, decision review, or appeal status | Veterans Affairs',
    );

    cy.axeCheck();
  });

  it('should display breadcrumb', () => {
    cy.get('va-breadcrumbs')
      .shadow()
      .within(() => {
        cy.findByRole('link', {
          name: 'VA.gov home',
        }).should('have.attr', 'href', '/');

        // TODO: Create issue for: Each breadcrumb segment should use the full page title
        cy.findByRole('link', {
          name: 'Check your claims and appeals',
        }).should('have.attr', 'href', '#content');
      });

    cy.axeCheck();
  });

  it('should display the page heading', () => {
    cy.findByRole('heading', {
      name: 'Check your claim, decision review, or appeal status',
    }).should('have.focus');

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
        name: 'Find out why we sometimes combine claims.',
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
        name: 'Find out why we sometimes combine claims.',
      })
      .click();

    cy.findByText(
      'If you turn in a new claim while we’re reviewing another one from you, we’ll add any new information to the original claim and close the new claim, with no action required from you.',
    ).should('be.visible');

    cy.axeCheck();
  });

  it('should display the card list no claims message', () => {
    // TODO: Create issue for: no claims message has alert styling
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
      'You can download your decision letters online. You can also get other letters related to your claims.',
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

    cy.findByRole('link', {
      name: 'Change your address and other contact information',
    }).should('have.attr', 'href', '/change-address/');

    cy.findByRole('link', {
      name: 'Change your legal name on file with VA',
    }).should(
      'have.attr',
      'href',
      '/resources/how-to-change-your-legal-name-on-file-with-va/',
    );

    cy.findByRole('link', {
      name: 'Get help filing your VA claim, decision review, or appeal',
    }).should('have.attr', 'href', '/disability/get-help-filing-claim/');

    cy.axeCheck();
  });

  it('should display the need help section', () => {
    cy.get('va-need-help')
      .shadow()
      .findByRole('heading', {
        name: 'Need help?',
      });

    cy.findByText('Call the VA benefits hotline at', { exact: false });

    cy.axeCheck();
  });
});
