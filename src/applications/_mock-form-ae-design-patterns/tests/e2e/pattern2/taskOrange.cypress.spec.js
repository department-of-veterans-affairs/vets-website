import { generateFeatureToggles } from 'applications/_mock-form-ae-design-patterns/mocks/endpoints/feature-toggles';
import manifest from '../../../manifest.json';
import mockUsers from '../../../mocks/endpoints/user';
import prefill from '../../../mocks/endpoints/in-progress-forms/22-1990';

describe('Prefill pattern - Orange Task', () => {
  beforeEach(() => {
    cy.login(mockUsers.loa3User72);

    cy.intercept('/v0/in_progress_forms/22-1990', {
      statusCode: 200,
      body: prefill.FORM_22_1990.minimal,
    }).as('mockSip');

    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles()).as(
      'mockFeatureToggles',
    );

    cy.intercept(
      'GET',
      '/v0/user?now=*',
      mockUsers.loa3UserWithUpdatedMailingAddress,
    ).as('mockUserUpdated');

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

  it('should show user as un-authenticated from the start', () => {
    cy.visit(`${manifest.rootUrl}/2`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /orange/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=false');

    cy.injectAxeThenAxeCheck();

    cy.get('va-button[text="Sign in to start your application"]').should(
      'exist',
    );

    // add extra stuff once mock login and intro changes have been merged
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

    // cy.wait('@mockSip');

    // check prefilled contact info page
    cy.url().should('contain', '/personal-information/contact-information');
    cy.findByText('Address').should('exist');
    cy.findByText('1234 Fake St.').should('exist');
    cy.findByText('Fort Collins').should('exist');
    cy.findByText('CO').should('exist');
    cy.findByText('80521').should('exist');

    cy.injectAxeThenAxeCheck();

    // add in editing flow once this main work has been merged
  });
});
