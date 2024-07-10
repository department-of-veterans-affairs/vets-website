import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import { Paths } from '../utils/constants';

describe('Secure Messaging Basic User', () => {
  it('verify basic user has not access to secure-messaging', () => {
    const basicUser = { ...mockUser };
    basicUser.data.attributes.services = basicUser.data.attributes.services.filter(
      service => service !== 'messaging',
    );

    SecureMessagingSite.login(true, basicUser);

    cy.intercept('GET', Paths.INTERCEPT.FEATURE_TOGGLES, mockFeatureToggles).as(
      'featureToggles',
    );
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

    cy.location('pathname').should('eq', Paths.HEALTH_CARE_SECURE_MSG);
  });
});
