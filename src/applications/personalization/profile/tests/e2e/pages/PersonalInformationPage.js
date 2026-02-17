import directDepositMocks from '@@profile/mocks/endpoints/direct-deposits';
import { mhvUser } from '@@profile/mocks/endpoints/user';
import mockFullNameSuccess from '../../fixtures/full-name-success.json';
import mockPersonalInformation from '../../fixtures/personal-information-success.json';
import mockServiceHistory from '../../fixtures/service-history-success.json';
import mockDisabilityRating from '../../fixtures/disability-rating-success.json';
import mockStatusInfo from '../../fixtures/status-info.json';
import mockSignature from '../../fixtures/personal-information-signature.json';
import mockToggles from '../../fixtures/personal-information-feature-toggles.json';
import { Locators, Paths } from '../../fixtures/constants';

class PersonalInformationPage {
  getPageHeader = () => {
    return cy.get(`h1`);
  };

  getCancelChangesBtn = () => {
    return cy
      .get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .first();
  };

  getBackToEditBtn = () => {
    return cy
      .get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .last();
  };

  load = (togglesResponse = mockToggles, signatureResponse = mockSignature) => {
    cy.intercept('v0/profile/full_name', mockFullNameSuccess).as(`full_name`);

    cy.intercept(
      'GET',
      'v0/profile/personal_information',
      mockPersonalInformation,
    ).as(`personal_info`);

    cy.intercept('v0/profile/service_history', mockServiceHistory).as(
      `service_history`,
    );

    cy.intercept(
      'v0/disability_compensation_form/rating_info',
      mockDisabilityRating,
    ).as(`disability_compensation`);

    cy.intercept(`GET`, `/v0/profile/status/`, mockStatusInfo).as(`status`);

    cy.intercept(
      `GET`,
      `/my_health/v1/messaging/preferences/signature`,
      signatureResponse,
    ).as(`signature`);

    cy.intercept(`GET`, `/v0/feature_toggles*`, togglesResponse);
    cy.intercept('GET', 'v0/profile/direct_deposits', directDepositMocks.base);

    cy.login(mhvUser);

    cy.visit(`/profile/personal-information`);

    this.getPageHeader().should(`have.text`, `Personal information`);

    cy.wait(`@signature`);
  };

  updateFeatureToggles = toggles => {
    return {
      ...mockToggles,
      data: {
        ...mockToggles.data,
        features: [...mockToggles.data.features, ...toggles],
      },
    };
  };

  verifyNoSignatureInterface = () => {
    cy.get(`#messaging-signature > h2`)
      .should('be.visible')
      .and('contain.text', 'Messages signature');
    cy.get(`#messaging-signature > span`)
      .should('be.visible')
      .and(
        'contain.text',
        'You can add a signature and signature title to be automatically added to all outgoing secure messages.',
      );
    cy.get('#edit-messages-signature')
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and('have.text', 'Edit');
  };

  verifyExistingSignatureInterface = () => {
    cy.get(`#messaging-signature > h2`)
      .should('be.visible')
      .and('contain.text', 'Messages signature');
    cy.get(`#messaging-signature > span`)
      .should('be.visible')
      .and(
        'contain.text',
        'You can add a signature and signature title to be automatically added to all outgoing secure messages.',
      );
    cy.get('#edit-messages-signature')
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and('have.text', 'Edit');
    cy.get(`#remove-messages-signature`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and('have.text', 'Remove');
    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `${mockSignature.data.attributes.signatureName +
        mockSignature.data.attributes.signatureTitle}`,
    );
  };

  saveSignature = (response = mockSignature) => {
    cy.intercept(`POST`, Paths.INTERCEPT.SIGNATURE, response).as(
      'updatedSignature',
    );

    cy.get(Locators.SIGNATURE.SAVE_BTN).click();
  };

  removeSignature = response => {
    cy.intercept(`POST`, Paths.INTERCEPT.SIGNATURE, response).as(
      'updatedSignature',
    );

    cy.get(Locators.SIGNATURE.REMOVE_BTN).click();
    cy.get(Locators.SIGNATURE.ALERTS.MODAL)
      .shadow()
      .find('va-button')
      .first()
      .click();
  };
}

export default new PersonalInformationPage();
