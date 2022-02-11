import loa1User from '@@profile/tests/fixtures/users/user-loa1.json';

import manifest from '~/applications/personalization/dashboard/manifest.json';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 * @param {array} stubs - array of Cy.stubs that should _not_ be called
 *
 * This helper:
 * - loads the my VA Dashboard,
 * - checks that focus is managed correctly, and performs an aXe scan
 */
function loa1DashboardTest(mobile, stubs) {
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // make sure that the "Verify" alert is shown
  cy.findByText(/Verify your identity to access/i).should('exist');
  cy.findByText(/we need to make sure you’re you/i).should('exist');

  // focus should be on the h1
  cy.focused()
    .contains('My VA')
    .and('have.prop', 'tagName')
    .should('equal', 'H1');

  // make sure that we don't call APIs to get name, service history, or disability rating
  cy.should(() => {
    stubs.forEach(stub => {
      expect(stub).not.to.be.called;
    });
  });

  // make sure that the name tag is not visible
  cy.findByTestId('name-tag').should('not.exist');

  // make sure the claims and appeals section is hidden
  cy.findByTestId('dashboard-section-claims-and-appeals').should('not.exist');

  // make sure that the health care section is hidden
  cy.findByTestId('dashboard-section-health-care').should('not.exist');

  // make sure that the apply for benefits section is visible
  cy.findByTestId('dashboard-section-apply-for-benefits').should('exist');

  // make sure all three benefits links are shown in the Apply For Benefits section
  cy.findByRole('link', { name: /apply for va health care/i }).should('exist');
  cy.findByRole('link', { name: /file a.*claim/i }).should('exist');
  cy.findByRole('link', { name: /apply for.*education benefits/i }).should(
    'exist',
  );

  // make the a11y check
  cy.injectAxe();
  cy.axeCheck();
}

describe('The My VA Dashboard', () => {
  let getAppealsStub;
  let getClaimsStub;
  let getServiceHistoryStub;
  let getEnrollmentStatusStub;
  let getFullNameStub;
  let getDisabilityRatingStub;
  let stubs;
  beforeEach(() => {
    cy.login(loa1User);
    getAppealsStub = cy.stub();
    getClaimsStub = cy.stub();
    getServiceHistoryStub = cy.stub();
    getEnrollmentStatusStub = cy.stub();
    getFullNameStub = cy.stub();
    getDisabilityRatingStub = cy.stub();
    stubs = [
      getAppealsStub,
      getClaimsStub,
      getServiceHistoryStub,
      getFullNameStub,
      getDisabilityRatingStub,
      getEnrollmentStatusStub,
    ];

    cy.intercept('/v0/appeals', () => {
      getAppealsStub();
    });
    cy.intercept('/v0/evss_claims_async', () => {
      getClaimsStub();
    });
    cy.intercept('/v0/profile/service_history', () => {
      getServiceHistoryStub();
    });
    cy.intercept('/v0/profile/full_name', () => {
      getFullNameStub();
    });
    cy.intercept('/v0/disability_compensation_form/rating_info', () => {
      getDisabilityRatingStub();
    });
    cy.intercept('/v0/health_care_applications/enrollment_status', () => {
      getEnrollmentStatusStub();
    });
  });
  it('should handle LOA1 users at desktop size', () => {
    loa1DashboardTest(false, stubs);
  });

  it.skip('should handle LOA1 users at mobile phone size', () => {
    loa1DashboardTest(true, stubs);
  });
});

describe('When clicking on the verify your identity link', () => {
  it('should focus on the h1 element', () => {
    cy.login(loa1User);
    cy.visit(manifest.rootUrl);
    cy.findByRole('link', { name: 'Verify your identity' })
      .should('have.attr', 'href', '/verify')
      .click();
    cy.get('h1').should('be.focused');
  });
});
