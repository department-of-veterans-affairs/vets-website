import fullName from '@@profile/tests/fixtures/full-name-success.json';

import { PROFILE_PATHS } from '@@profile/constants';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
import { loa3User72 } from '../../../mocks/endpoints/user';
import {
  airForce,
  none,
  dishonorableDischarge,
  unknownDischarge,
} from '../../../mocks/endpoints/service-history';
import MilitaryInformation from '../military-information/MilitaryInformation';

describe('Proof of Veteran status', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowProofOfVeteranStatus: true,
      }),
    );
    cy.login(loa3User72);
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/service_history', airForce);
  });

  it('Should display the Proof of Veteran Status component', () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();

    MilitaryInformation.veteranStatusShouldExist;
  });
});

describe('Veteran is not eligible', () => {
  const login = ({ dischargeCode }) => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowProofOfVeteranStatus: true,
      }),
    );
    cy.login(loa3User72);
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/service_history', dischargeCode);
  };

  it('should not display when there is no service history returned', () => {
    login(none);
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist;
  });

  it('should not display when veteran has an unknown discharge status', () => {
    login(unknownDischarge);
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist;
  });

  it('should not display when veteran was dishonorably discharged', () => {
    login(dishonorableDischarge);
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist;
  });
});
