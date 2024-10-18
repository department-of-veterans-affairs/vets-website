import manifest from '../../../manifest.json';
import { mockInterceptors } from '../helpers';

describe('Prefill pattern - Blue Task', () => {
  beforeEach(() => {
    mockInterceptors();

    // intercept for phone api calls
    cy.intercept('/v0/profile/telephones', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_mock_transactions',
          attributes: {
            transactionId: 'mock-update-phone-transaction-id',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::MockTransaction',
            metadata: [],
          },
        },
      },
    });
  });

  it('should show user as authenticated from the start', () => {
    cy.visit(`${manifest.rootUrl}/2`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /blue/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.findByText('Request a Board Appeal').should('exist');

    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/veteran-details');

    cy.findByRole('button', { name: /continue/i }).click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/veteran-information');
  });

  it('should successfully show prefill data on the form and allow updating mobile phone', () => {
    cy.visit(`${manifest.rootUrl}/2/task-blue/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    // there are two buttons with the same text, so we need to find the first one
    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    // check prefilled contact info page
    cy.url().should('contain', '/veteran-information');
    cy.findByText('Home phone number').should('exist');
    cy.get('va-telephone[contact="9898981233"]').should('exist');

    cy.findByText('Mobile phone number').should('exist');
    cy.get('va-telephone[contact="6195551234"]').should('exist');

    cy.findByText('Email address').should('exist');
    cy.findByText('myemail72585885@unattended.com').should('exist');

    cy.findByText('Mailing address').should('exist');
    cy.findByText('123 Mailing Address St.').should('exist');
    cy.findByText('Fulton, NY 97063').should('exist');

    cy.injectAxeThenAxeCheck();

    // update phone number and save form
    cy.findByLabelText('Edit mobile phone number').click();

    // need this to access the input in the web component shadow dom
    cy.get('va-text-input[name="root_inputPhoneNumber"]')
      .shadow()
      .find('input')
      .as('mobilePhoneInput');

    cy.get('@mobilePhoneInput').clear();
    cy.get('@mobilePhoneInput').type('6192334567');
    cy.findByTestId('save-edit-button').click();

    // redirect to previous page and show save alert
    cy.url().should('contain', '/veteran-information');
    cy.findByText('We’ve updated your mobile phone number').should('exist');
    cy.findByText('Mobile phone number').should('exist');
    cy.get('va-telephone[contact="6192334567"]').should('exist');

    // once the task is complete it should redirect to the pattern landing page
    cy.findByRole('button', { name: /Continue/i }).click();
    cy.url().should('contain', 'mock-form-ae-design-patterns/');
  });
});
