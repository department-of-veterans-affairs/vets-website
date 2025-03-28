import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockUser from '../fixtures/userResponse/user.json';
import { Paths } from '../utils/constants';
import mockSignature from '../fixtures/signature-response.json';

// this class is for build MHV home page which could not be used at the moment
// using this class will fail CI runs as they're using "mhv-sm" env entry
// MHV home does not belong to MHV SM, but I'll keep it for possibles further inquires
class MhvPage {
  loadHomePage = (
    featureToggles = mockFeatureToggles,
    url = '/my-health/',
    recipients = mockRecipients,
    user = mockUser,
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

    // required for further actions
    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');

    cy.visit(url, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
  };
}

export default new MhvPage();
