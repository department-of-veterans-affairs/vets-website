import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import { Paths } from '../utils/constants';

describe('Secure Messaging Basic User', () => {
  it('verify basic user does not have access to secure-messaging', () => {
    const basicUser = { ...mockUser };
    basicUser.data.attributes.services = basicUser.data.attributes.services.filter(
      service => service !== 'messaging',
    );

    SecureMessagingSite.login(mockFeatureToggles, true, basicUser);

    cy.intercept('GET', '/v0/user', basicUser).as('user');
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
