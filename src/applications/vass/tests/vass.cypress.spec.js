import manifest from '../manifest.json';

describe(manifest.appName, () => {
  beforeEach(() => {
    cy.intercept('POST', '/vass/v0/authenticate-otc', req => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            token: 'mock-jwt-token',
            expiresIn: 3600,
            tokenType: 'Bearer',
          },
        },
      });
    }).as('otcVerification');
  });

  it('redirects to already-scheduled page when user has existing appointment', () => {
    // Mock getUserAppointment to return an existing appointment
    cy.intercept('GET', '/vass/v0/user/appointment', {
      statusCode: 200,
      body: {
        data: {
          appointmentId: 'existing123',
          dtStartUtc: '2025-05-01T16:00:00.000Z',
          phoneNumber: '8008270611',
          typeOfCare: 'Solid Start',
          providerName: 'Test Provider',
          topics: [
            { topicId: '123', topicName: 'Benefits' },
            { topicId: '456', topicName: 'Health care' },
          ],
        },
      },
    }).as('getUserAppointment');

    // Visit the app with UUID
    cy.visit(
      '/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678',
    );

    // Fill in verification form
    cy.get('va-text-input[data-testid="last-name-input"]')
      .shadow()
      .find('input')
      .type('Smith');

    cy.get('va-memorable-date[data-testid="dob-input"]').then($el => {
      $el[0].__events.dateChange({ target: { value: '1935-04-07' } });
    });

    cy.get('va-button[data-testid="submit-button"]')
      .shadow()
      .find('button')
      .click();

    // Should be on enter-otc page
    cy.url().should('include', '/enter-otc');

    // Enter OTC code
    cy.get('va-text-input[name="otc"]')
      .shadow()
      .find('input')
      .type('123456');

    cy.get('va-button[data-testid="continue-button"]')
      .shadow()
      .find('button')
      .click();

    // Wait for API calls
    cy.wait('@otcVerification');
    cy.wait('@getUserAppointment');

    // Should redirect to already-scheduled page
    cy.url().should('include', '/already-scheduled');
    cy.get('[data-testid="already-scheduled-page"]').should('exist');
    cy.get('[data-testid="already-scheduled-date-time"]').should('exist');
  });

  it('continues to scheduling flow when user has no existing appointment', () => {
    // Mock getUserAppointment to return 404 (no appointment)
    cy.intercept('GET', '/vass/v0/user/appointment', {
      statusCode: 404,
      body: {
        errors: [
          {
            code: 'not_found',
            detail: 'No appointment found for user',
            status: 404,
          },
        ],
      },
    }).as('getUserAppointment');

    // Visit the app with UUID
    cy.visit(
      '/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678',
    );

    // Fill in verification form
    cy.get('va-text-input[data-testid="last-name-input"]')
      .shadow()
      .find('input')
      .type('Smith');

    cy.get('va-memorable-date[data-testid="dob-input"]').then($el => {
      $el[0].__events.dateChange({ target: { value: '1935-04-07' } });
    });

    cy.get('va-button[data-testid="submit-button"]')
      .shadow()
      .find('button')
      .click();

    // Should be on enter-otc page
    cy.url().should('include', '/enter-otc');

    // Enter OTC code
    cy.get('va-text-input[name="otc"]')
      .shadow()
      .find('input')
      .type('123456');

    cy.get('va-button[data-testid="continue-button"]')
      .shadow()
      .find('button')
      .click();

    // Wait for API calls
    cy.wait('@otcVerification');
    cy.wait('@getUserAppointment');

    // Should continue to date-time page
    cy.url().should('include', '/date-time');
  });

  it.skip('is accessible', () => {
    // Skip tests in CI until the app is released.
  });
});
