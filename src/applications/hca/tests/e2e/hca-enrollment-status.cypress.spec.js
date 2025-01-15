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
