import fullName from '@@profile/tests/fixtures/full-name-success.json';

import { PROFILE_PATHS } from '@@profile/constants';
import { loa3User72 } from '../../../mocks/endpoints/user';
import { airForce, none } from '../../../mocks/endpoints/service-history';
import {
  apiError,
  confirmed,
  notConfirmedProblem,
} from '../../../mocks/endpoints/vet-verification-status';
import VeteranStatusInfo from './VeteranStatusCard';

describe('Veteran Status Card', () => {
  describe('Successful', () => {
    beforeEach(() => {
      cy.login(loa3User72);
      cy.intercept('GET', '/v0/user', loa3User72);
      cy.intercept('GET', '/v0/profile/full_name', fullName);
      cy.intercept('GET', '/v0/profile/service_history', airForce);
      cy.intercept('GET', '/v0/profile/vet_verification_status', confirmed);
    });

    it('Should display the Veteran Status Card component', () => {
      cy.visit(PROFILE_PATHS.VETERAN_STATUS_CARD);
      cy.injectAxeThenAxeCheck();

      VeteranStatusInfo.veteranStatusShouldExist();
    });
  });

  describe('Alert', () => {
    beforeEach(() => {
      cy.login(loa3User72);
      cy.intercept('GET', '/v0/user', loa3User72);
      cy.intercept('GET', '/v0/profile/full_name', fullName);
    });
    it('Should display Vet verification status warning', () => {
      cy.intercept('GET', '/v0/profile/service_history', airForce);
      cy.intercept(
        'GET',
        '/v0/profile/vet_verification_status',
        notConfirmedProblem,
      );
      cy.visit(PROFILE_PATHS.VETERAN_STATUS_CARD);
      cy.injectAxeThenAxeCheck();

      VeteranStatusInfo.veteranStatusShouldNotExist();
      cy.findByText(notConfirmedProblem.data.title).should('exist');
    });

    it('Should display Vet status eligibility warning', () => {
      cy.intercept('GET', '/v0/profile/service_history', none);
      cy.intercept('GET', '/v0/profile/vet_verification_status', confirmed);
      cy.visit(PROFILE_PATHS.VETERAN_STATUS_CARD);
      cy.injectAxeThenAxeCheck();

      VeteranStatusInfo.veteranStatusShouldNotExist();
      cy.findByText(none.data.attributes.vetStatusEligibility.title).should(
        'exist',
      );
    });

    it('Should display system error', () => {
      cy.intercept('GET', '/v0/profile/service_history', airForce);
      cy.intercept('GET', '/v0/profile/vet_verification_status', apiError);
      cy.visit(PROFILE_PATHS.VETERAN_STATUS_CARD);
      cy.injectAxeThenAxeCheck();

      VeteranStatusInfo.veteranStatusShouldNotExist();
      cy.findByText(
        'We’re sorry. Try to view your Veteran Status Card later.',
      ).should('exist');
    });
  });
});
