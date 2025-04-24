import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockUser from '../fixtures/userResponse/user.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import { Paths } from '../utils/constants';

class SecureMessagingLandingPage {
  loadMainPage = (
    featureToggles = mockFeatureToggles,
    url = Paths.UI_MAIN,
    recipients = mockRecipients,
    user = mockUser,
    messages = mockGeneralMessages,
  ) => {
    cy.intercept('GET', Paths.INTERCEPT.FEATURE_TOGGLES, featureToggles).as(
      'featureToggles',
    );

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
      recipients,
    ).as('Recipients');

    cy.intercept('GET', '/v0/user', user).as('user');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0*`,
      mockGeneralFolder,
    ).as('generalFolder');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/messages*`,
      messages,
    ).as('generalMessages');

    cy.visit(url, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
  };
}

export default new SecureMessagingLandingPage();
