import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';

import ERROR_500 from '@@profile/tests/fixtures/500.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import vamcErc from '../fixtures/vamc-ehr.json';
import ERROR_400 from '~/applications/personalization/dashboard/utils/mocks/ERROR_400';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { makeUserObject } from './dashboard-e2e-helpers';

const alertText = /We’re sorry. Something went wrong on our end and we can’t access your appointment information. Please try again later or go to the appointments tool/i;

describe('MyVA Dashboard - Appointments Error States', () => {
  beforeEach(() => {
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcErc);
  });

  describe('when the user has VA Healthcare', () => {
    context('when there is a 500 error fetching VA appointments', () => {
      it('should show the appointments error alert and never call the facilities API', () => {
        cy.intercept('GET', '/vaos/v2/appointments*', {
          statusCode: 500,
          body: ERROR_500,
        });

        cy.login(mockUser);
        cy.visit('my-va/');

        cy.findByText(alertText).should('exist');
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        cy.injectAxeThenAxeCheck();
      });
    });

    context('when there is a 400 error fetching VA appointments', () => {
      it('should show the appointments error alert and never call the facilities API', () => {
        cy.intercept('GET', '/vaos/v2/appointments*', {
          statusCode: 400,
          body: ERROR_400,
        });

        cy.login(mockUser);
        cy.visit('my-va/');

        cy.findByText(alertText).should('exist');
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        cy.injectAxeThenAxeCheck();
      });
    });

    describe('when the user does not have VA Healthcare', () => {
      it('the dashboard shows up and shows no healthcare text', () => {
        const mockUser4 = makeUserObject({
          isCerner: false,
          messaging: false,
          rx: false,
          facilities: [],
          isPatient: false,
        });
        cy.login(mockUser4);
        cy.visit('my-va/');

        cy.findByTestId('dashboard-section-health-care').should('not.exist');
        cy.findByTestId('dashboard-section-health-care').should('exist');
        cy.findByTestId('no-healthcare-text').should('exist');
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'not.exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('not.exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('apply-va-healthcare-link-from-cta').should('exist');

        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
