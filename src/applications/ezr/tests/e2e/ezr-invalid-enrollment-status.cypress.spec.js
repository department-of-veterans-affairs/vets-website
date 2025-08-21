import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import featureToggles from './fixtures/mocks/mock-features.json';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';

describe('EZR Invalid Enrollment Status', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 200,
      body: {
        ...MOCK_ENROLLMENT_RESPONSE,
        parsedStatus: 'pending_PurpleHeart',
      },
    }).as('mockEnrollmentStatus');
  });

  it('displays an enrollment status warning message', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    cy.get('va-alert').contains(
      'Our records show that you\u2019re not enrolled in VA health care',
    );
  });
});
