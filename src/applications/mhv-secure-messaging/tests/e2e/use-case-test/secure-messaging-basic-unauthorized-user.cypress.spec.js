import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import { Paths } from '../utils/constants';

describe('SM BASIC USER', () => {
  it('verify basic user does not have access to secure-messaging', () => {
    const unauthorizedUser = { ...mockUser };
    unauthorizedUser.data.attributes.profile.verified = false;

    SecureMessagingSite.login(mockFeatureToggles, true, unauthorizedUser);

    cy.intercept('GET', '/v0/user', unauthorizedUser).as('user');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0*`,
      mockGeneralFolder,
    ).as('generalFolder');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/messages*`,
      mockGeneralMessages,
    ).as('generalMessages');

    cy.visit('my-health/secure-messages/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.location('pathname').should('contain', Paths.MHV_LANDING_PAGE);
    cy.location('pathname').should('not.contain', Paths.MHV_SM);

    cy.injectAxe();
    cy.axeCheck();
  });
});
