import fullName from '@@profile/tests/fixtures/full-name-success.json';

import { PROFILE_PATHS } from '@@profile/constants';
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
    cy.login(loa3User72);
    cy.intercept('GET', '/v0/user', loa3User72);
    cy.intercept('GET', '/v0/profile/full_name', fullName.success);
    cy.intercept('GET', '/v0/profile/service_history', airForce);
  });

  it('Should display the Proof of Veteran Status component', () => {
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();

    MilitaryInformation.veteranStatusShouldExist();
  });
});

const login = ({ dischargeCode }) => {
  cy.login(loa3User72);
  cy.intercept('GET', '/v0/user', loa3User72);
  cy.intercept('GET', '/v0/profile/full_name', fullName.success);
  cy.intercept('GET', '/v0/profile/service_history', dischargeCode);
};

describe('Veteran is not eligible', () => {
  it('should not display when there is no service history returned', () => {
    login({ dischargeCode: none });
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist();
  });

  it('should not display when veteran has an unknown discharge status', () => {
    login({ dischargeCode: unknownDischarge });
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist();
  });

  it('should not display when veteran was dishonorably discharged', () => {
    login({ dischargeCode: dishonorableDischarge });
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.injectAxeThenAxeCheck();
    MilitaryInformation.veteranStatusShouldNotExist();
  });
});
