import { PROFILE_PATHS } from '../../constants';
import mockUser from '../fixtures/users/user-36.json';
import mockFeatureToggles from '../fixtures/feature-toggles.json';
import emailUpdateResponseFailure from '../fixtures/email-400.json';

const setup = (mobile = false) => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

  if (mobile) {
    cy.viewport('iphone-4');
  }

  cy.login(mockUser);
  cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  cy.route({
    method: 'PUT',
    url: '/v0/profile/email_addresses',
    status: 400,
    response: emailUpdateResponseFailure,
  }).as('mockEmailUpdateFailure');

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');
};

describe('The update email Alert', () => {
  it('should render with the correct copy', () => {
    setup();
    const errorText = 'It looks like the email you entered isn’t valid.';

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit email address`, 'i'),
    }).click({
      force: true,
    });

    cy.get(`#root_emailAddress`)
      .click()
      .clear()
      .type('test@test.cocococococom');

    // Open edit view
    cy.findByRole('button', { name: 'Update' }).click({
      force: true,
    });

    cy.wait('@mockEmailUpdateFailure');
    cy.contains(errorText).should('exist');
  });
});
