import { user72Success, nonVeteranUser } from '../../../mocks/user';

import { generateFeatureToggles } from '../../../mocks/feature-toggles';
import fullName from '../../../mocks/full-name';
import { handleGetPersonalInformationRoute } from '../../../mocks/personal-information';
import serviceHistory from '../../../mocks/service-history';

import MilitaryInformation from './MilitaryInformation';

describe('Military Information - Profile page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowBadAddressIndicator: true,
        profileAlwaysShowDirectDepositDisplay: true,
      }),
    );
    cy.intercept('GET', '/v0/user', user72Success);

    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/personal_information', resp => {
      const req = {
        query: { now: true },
      };
      const res = {
        json: resp.reply,
      };
      handleGetPersonalInformationRoute(req, res);
    });
    cy.intercept('GET', '/v0/profile/service_history', resp => {
      return resp.reply(500, serviceHistory.error);
    });
  });

  it('Should not display error message on Personal and Contact page', () => {
    cy.login(user72Success);
    MilitaryInformation.visitContactInformationPage();
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.heroErrorMessageShouldNotExist();
    MilitaryInformation.visitPersonalInformationPage();
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.heroErrorMessageShouldNotExist();
  });
  it('should display correct error messaging on military information page', () => {
    cy.login(user72Success);
    MilitaryInformation.visitMilitaryInformationPage();
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.heroErrorMessageShouldNotExist();
    MilitaryInformation.serviceDownMessageShouldExist();
  });
});

describe('Military Information - NonVeteran', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowBadAddressIndicator: true,
        profileAlwaysShowDirectDepositDisplay: true,
      }),
    );
    cy.intercept('GET', '/v0/user', nonVeteranUser);

    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/personal_information', resp => {
      const req = {
        query: { now: true },
      };
      const res = {
        json: resp.reply,
      };
      handleGetPersonalInformationRoute(req, res);
    });
    cy.intercept('GET', '/v0/profile/service_history', resp => {
      return resp.reply(500, serviceHistory.generateServiceHistoryError('403'));
    });
  });
  it('should display non veteran user error on military information page', () => {
    cy.login(nonVeteranUser);
    MilitaryInformation.visitMilitaryInformationPage();
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.heroErrorMessageShouldNotExist();
    MilitaryInformation.notAVeteranMessageShouldExist();
  });
});

describe('Military Information - NotInDeers', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowBadAddressIndicator: true,
        profileAlwaysShowDirectDepositDisplay: true,
      }),
    );
    cy.intercept('GET', '/v0/user', user72Success);

    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/personal_information', resp => {
      const req = {
        query: { now: true },
      };
      const res = {
        json: resp.reply,
      };
      handleGetPersonalInformationRoute(req, res);
    });
    cy.intercept('GET', '/v0/profile/service_history', resp => {
      return resp.reply(403, serviceHistory.generateServiceHistoryError('403'));
    });
  });
  it('should display non veteran user error on military information page', () => {
    cy.login(nonVeteranUser);
    MilitaryInformation.visitMilitaryInformationPage();
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.heroErrorMessageShouldNotExist();
    MilitaryInformation.notInDeersMessageShouldExist();
  });
});
