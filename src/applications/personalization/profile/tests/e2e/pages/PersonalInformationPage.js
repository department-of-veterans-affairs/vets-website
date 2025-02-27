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

  load = featureToggles => {
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
      mockSignature,
    );

    SecureMessagingSite.login(featureToggles);

    cy.visit(`/profile/personal-information`);

    this.getPageHeader().should(`have.text`, `Personal information`);
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
}

export default new PersonalInformationPage();
