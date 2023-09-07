import loa1User from '@@profile/tests/fixtures/users/user-loa1.json';
import manifest from '~/applications/personalization/dashboard/manifest.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

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

  // TODO: update cy.viewport to Cypress.env().vaTopMobileViewports
  // https://depo-platform-documentation.scrollhelp.site/developer-docs/viewport-testing-helper-functions
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // make sure that the "Verify" alert is shown
  cy.findByText(/Verify your identity to access/i).should('exist');
  cy.findByText(/we need to make sure you’re you/i).should('exist');
  cy.findByRole('link', { name: 'Verify your identity' }).should(
    'have.attr',
    'href',
    '/verify',
  );

  // make sure that we don't call APIs to get name, service history, or disability rating
  cy.should(() => {
    stubs.forEach(stub => {
      expect(stub).not.to.be.called;
    });
  });

  // make sure that the name tag is not visible
  cy.findByTestId('name-tag').should('not.exist');

  context('Before UX updates', () => {
    cy.findByTestId('dashboard-section-claims-and-appeals').should('not.exist');
    cy.findByRole('link', { name: /file a.*claim/i }).should('exist');

    cy.findByTestId('dashboard-section-health-care').should('not.exist');

    // make sure that the apply for benefits section is visible
    cy.findByTestId('dashboard-section-apply-for-benefits').should('exist');

    // make sure that the Education and training section is visible
    cy.findByTestId('dashboard-section-education-and-training').should(
      'not.exist',
    );
  });
}

const loa1AfterUxUpdates = mobile => {
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // make sure that the "Verify" alert is shown
  cy.findByText(/Verify your identity to access/i).should('exist');
  cy.findByText(/we need to make sure you’re you/i).should('exist');
  cy.findByRole('link', { name: 'Verify your identity' }).should(
    'have.attr',
    'href',
    '/verify',
  );

  // make sure the claims and appeals section is visible
  cy.findByTestId('dashboard-section-claims-and-appeals').should('exist');
  cy.findByRole('link', { name: /file a.*claim/i }).should('exist');

  // make sure that the health care section is visible
  cy.findByTestId('dashboard-section-health-care').should('exist');
  cy.findByRole('link', { name: /apply for va health care/i }).should('exist');

  // make sure that the Benefit application drafts section is visible
  cy.findByTestId('dashboard-section-saved-applications').should('exist');

  // make sure that the Education and training section is visible
  cy.findByTestId('dashboard-section-education-and-training').should('exist');
  cy.findByRole('link', {
    name: /learn how to apply for va education benefits/i,
  }).should('exist');
};

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
    cy.intercept('/v0/benefits_claims', () => {
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
    // delete instances of feature toggle when new appts URL is launched
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: featureFlagNames.myVaUseExperimentalFrontend,
            value: true,
          },
        ],
      },
    }).as('loa1Feature');
    loa1AfterUxUpdates(false);

    // make the a11y check
    cy.injectAxe();
    cy.axeCheck();
  });

  it('should handle LOA1 users at mobile phone size', () => {
    loa1DashboardTest(true, stubs);
    // delete instances of feature toggle when new appts URL is launched
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: featureFlagNames.myVaUseExperimentalFrontend,
            value: true,
          },
        ],
      },
    }).as('loa1Feature');
    loa1AfterUxUpdates(true);

    // make the a11y check
    cy.injectAxe();
    cy.axeCheck();
  });
});
