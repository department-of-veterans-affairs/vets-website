import { getTime } from 'date-fns';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mockUser';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import {
  HCA_ENROLLMENT_STATUSES,
  HCA_APPLY_ALLOWED_STATUSES,
} from '../../utils/constants';

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
      cy.intercept('/v0/in_progress_forms/1010ez', {
        statusCode: 200,
        body: mockPrefill,
      }).as('mockSip');
      cy.intercept('POST', '/v0/health_care_applications', {
        statusCode: 200,
        body: {
          formSubmissionId: '123fake-submission-id-567',
          timestamp: getTime(new Date()),
        },
      }).as('mockSubmit');
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

      if (HCA_APPLY_ALLOWED_STATUSES.has(status)) {
        cy.get('va-omb-info').should('exist');
      } else {
        cy.get('va-omb-info').should('not.exist');
      }

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('HCA-Enrollment-Status: Server Error', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 500,
      body: {
        hasServerError: true,
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
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: getTime(new Date()),
      },
    }).as('mockSubmit');
  });

  it('should render correct content based on status', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.get('[data-testid="form-title"]').should('exist');

    cy.get('[data-testid="hca-server-error-alert"]').should('exist');
    cy.get('[data-testid="hca-enrollment-alert"]').should('not.exist');
    cy.get('va-process-list').should('not.exist');

    cy.injectAxeThenAxeCheck();
  });
});
