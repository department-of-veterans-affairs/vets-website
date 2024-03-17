import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mockUser';
import { HCA_ENROLLMENT_STATUSES } from '../../utils/constants';

Object.values(HCA_ENROLLMENT_STATUSES).forEach(status => {
  describe(`HCA-Enrollment-Status: ${status}`, () => {
    beforeEach(() => {
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
        'mockFeatures',
      );
      cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
        statusCode: 200,
        body: {
          parsedStatus: status,
          applicationDate: '2019-04-24T00:00:00.000-06:00',
          enrollmentDate: '2019-04-30T00:00:00.000-06:00',
          preferredFacility: '463 - CHEY6',
        },
      }).as('mockEnrollmentStatus');
      cy.intercept('/v0/health_care_applications/rating_info', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'hash',
            attributes: { userPercentOfDisability: 0 },
          },
        },
      }).as('mockDisabilityRating');
    });

    it('should render correct content based on status', () => {
      cy.visit(manifest.rootUrl);
      cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
      cy.get('[data-testid="form-title"]').should('exist');

      if (status === HCA_ENROLLMENT_STATUSES.noneOfTheAbove) {
        cy.get('[data-testid="hca-enrollment-alert"]').should('not.exist');
        cy.get('va-process-list').should('exist');
      } else {
        cy.get('[data-testid="hca-enrollment-alert"]').should('exist');
        cy.get('va-process-list').should('not.exist');
      }

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
