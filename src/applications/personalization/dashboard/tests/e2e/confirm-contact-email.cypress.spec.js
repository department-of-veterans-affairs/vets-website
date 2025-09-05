import { mockUser } from '@@profile/tests/fixtures/users/user';

describe(`MyVA Dashboard -- confirm contact email`, () => {
  beforeEach(() => {
    cy.login(mockUser);
  });

  it('displays the confirm contact email alert', () => {
    cy.visit('/my-va');
    cy.findByTestId('va-profile--confirm-contact-email-link');
    cy.injectAxeThenAxeCheck();
  });

  it('suppresses the confirm contact email alert when dismissed', () => {
    cy.setCookie('CONTACT_EMAIL_CONFIRMED', 'true', 5000);
    cy.visit('/my-va');
    cy.get('va-profile--confirm-contact-email-link').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
