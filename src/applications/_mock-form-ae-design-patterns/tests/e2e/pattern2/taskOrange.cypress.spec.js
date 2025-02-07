import { generateFeatureToggles } from 'applications/_mock-form-ae-design-patterns/mocks/endpoints/feature-toggles';
import manifest from '../../../manifest.json';
import { loa3User } from '../../../mocks/endpoints/user';
import prefill from '../../../mocks/endpoints/in-progress-forms/22-1990';

describe('Prefill pattern - Orange Task', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/user', loa3User).as('mockUser');

    cy.intercept('/v0/in_progress_forms/22-1990', {
      statusCode: 200,
      body: prefill,
    }).as('mockSip');

    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles()).as(
      'mockFeatureToggles',
    );

    cy.intercept('GET', '/v0/user?now=*', loa3User).as('mockUserUpdated');

    cy.intercept('GET', '/v0/profile/status/*', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_mock_transactions',
          attributes: {
            transactionId: 'mock-update-mailing-address-success-transaction-id',
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::MockTransaction',
            metadata: [],
          },
        },
      },
    });
  });

  it('should successfully show unauthenticated alert and then log user in on button click', () => {
    cy.visit(`${manifest.rootUrl}/2`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /orange/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=false');

    cy.injectAxeThenAxeCheck();

    cy.get('va-button[text="Sign in to start your application"]').click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.get('a.vads-c-action-link--green')
      .contains('Start the education application')
      .first()
      .click();

    cy.url().should('contain', '/applicant-information');
  });

  it('should successfully show prefill data on the form', () => {
    cy.visit(`${manifest.rootUrl}/2/task-orange/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    cy.get('a.vads-c-action-link--green')
      .contains('Start the education application')
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/applicant-information');

    cy.findByRole('button', { name: /continue/i }).click();

    cy.url().should('contain', '/contact-information');

    cy.findByRole('button', { name: /continue/i }).click();

    // check prefilled review page
    cy.url().should('contain', '/review-then-submit');
    cy.findByText('Mailing address').should('exist');
    cy.findByText('125 Main St.').should('exist');
    cy.findByText('Fulton').should('exist');
    cy.findByText('New York').should('exist');
    cy.findByText('97063').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
