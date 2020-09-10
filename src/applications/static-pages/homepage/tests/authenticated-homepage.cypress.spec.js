import mockUser from 'applications/personalization/profile-2/tests/fixtures/users/user-36.json';
// import mockFeatureToggles from 'applications/static-pages/authenticated-homepage/tests/fixtures/feature-toggles.json';

const checkAuthenticatedHomepageVisible = () => {
  // expect('.homepage-hub]').to.not.contain(
  //   'Access and manage your VA benefits and health care',
  // );
  cy.get('[data-widget-type="authenticated-homepage"]').should('be.visible');
  cy.get('[data-widget-type="authenticated-homepage"]').should('not.be.empty');
};

const checkAuthenticatedHomepageNotVisible = () => {
  cy.get('[id="homepage"]').should('be.visible');
  cy.get('[data-widget-type="authenticated-homepage"]').should(
    'not.be.visible',
  );
  cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
};

describe('The authenticated homepage', () => {
  describe('does not render when the user is not logged in and', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('no values are set in localStorage or Feature Flag', () => {
      checkAuthenticatedHomepageNotVisible();
    });

    it('the localStorage value of AUTHENTICATED_HOMEPAGE is "true"', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      checkAuthenticatedHomepageNotVisible();
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   cy.reload();
    //   checkAuthenticatedHomepageNotVisible();
    // });
  });

  describe('does not render when the user is logged in and', () => {
    beforeEach(() => {
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
      cy.login(mockUser);
      cy.visit('/');
    });

    it('the localStorage value of AUTHENTICATED_HOMEPAGE is "true" and then set to "false"', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      cy.wait(2000);
      checkAuthenticatedHomepageVisible();
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', false);
      cy.reload();
      checkAuthenticatedHomepageNotVisible();
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on and AUTHENICATED_HOMEPAGE is "false"', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   localStorage.setItem('AUTHENTICATED_HOMEPAGE', false);
    //   cy.visit('/');
    //   checkAuthenticatedHomepageNotVisible();
    // });
  });

  describe('renders when the user is logged in and', () => {
    beforeEach(() => {
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
      cy.login(mockUser);
      cy.visit('/');
    });

    it('the localStorage value of AUTHENTICATED_HOMEPAGE is "true"', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      checkAuthenticatedHomepageVisible();
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   checkAuthenticatedHomepageVisible();
    // });
  });
});
