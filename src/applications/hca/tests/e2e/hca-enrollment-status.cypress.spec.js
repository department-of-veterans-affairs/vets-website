import {
  HCA_APPLY_ALLOWED_STATUSES,
  HCA_ENROLLMENT_STATUSES,
} from '../../utils/constants';
import { setupForAuth } from './utils';

Object.values(HCA_ENROLLMENT_STATUSES).forEach(status => {
  describe(`HCA-Enrollment-Status: ${status}`, () => {
    beforeEach(() => {
      const enrollmentStatus = {
        statusCode: 200,
        body: {
          parsedStatus: status,
          applicationDate: '2019-04-24T00:00:00.000-06:00',
          enrollmentDate: '2019-04-30T00:00:00.000-06:00',
          preferredFacility: '463 - CHEY6',
        },
      };
      setupForAuth({ enrollmentStatus });
    });

    it('should render correct content based on status', () => {
      const isNA = status === HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
      const hasStatus = HCA_APPLY_ALLOWED_STATUSES.has(status);

      cy.get('[data-testid="hca-enrollment-alert"]').should(
        isNA ? 'not.exist' : 'exist',
      );
      cy.get('va-process-list').should(isNA ? 'exist' : 'not.exist');
      cy.get('va-omb-info').should(hasStatus ? 'exist' : 'not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('HCA-Enrollment-Status: Server Error', () => {
  beforeEach(() => {
    const enrollmentStatus = {
      statusCode: 500,
      body: {
        hasServerError: true,
      },
    };
    setupForAuth({ enrollmentStatus });
  });

  it('should render correct content based on status', () => {
    cy.get('[data-testid="hca-server-error-alert"]').should('exist');
    cy.get('[data-testid="hca-enrollment-alert"]').should('not.exist');
    cy.get('va-process-list').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
