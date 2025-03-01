import SecureMessagingSite from '../../../../../mhv-secure-messaging/tests/e2e/sm_site/SecureMessagingSite';
import mockFullNameSucess from '../../fixtures/full-name-success.json';
import mockPersonalInformation from '../../fixtures/personal-information-success.json';
import mockServiceHistory from '../../fixtures/service-history-success.json';
import mockDisabilityRating from '../../fixtures/disability-rating-success.json';
import mockStatusInfo from '../../fixtures/status-info.json';
import mockSignature from '../../fixtures/personal-information-signature.json';
import mockToggles from '../../fixtures/personal-information-feature-toggles.json';

class PersonalInformationPage {
  getPageHeader = () => {
    return cy.get(`h1`);
  };

  load = (togglesResponse = mockToggles, signatureResponse = mockSignature) => {
    cy.intercept('v0/profile/full_name', mockFullNameSucess).as(`full_name`);

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

    SecureMessagingSite.login(togglesResponse);

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
      .should('be.visible')
      .and('have.text', 'Edit');
    cy.get(`#remove-messages-signature`)
      .should('be.visible')
      .and('have.text', 'Remove');
    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `${mockSignature.data.attributes.signatureName +
        mockSignature.data.attributes.signatureTitle}`,
    );
  };
}

export default new PersonalInformationPage();
