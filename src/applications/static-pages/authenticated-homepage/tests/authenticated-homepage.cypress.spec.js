import mockUser from 'applications/personalization/profile-2/tests/fixtures/users/user-36.json';
// import mockFeatureToggles from 'applications/static-pages/authenticated-homepage/tests/fixtures/feature-toggles.json';

describe('The authenticated homepage', () => {
  describe('does not render when the user is not logged in and', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('no values are set in localStorage or Feature Flag', () => {
      cy.get('[id="homepage"]').should('be.visible');
      cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
    });

    it('the localStorage value of AUTHENTICATED_HOMEPAGE is "true"', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      cy.get('[id="homepage"]').should('be.visible');
      cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   cy.reload();
    //   cy.get('[id="homepage"]').should('be.visible');
    //   cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
    // });
  });

  describe('does not render when the user is logged in and', () => {
    beforeEach(() => {
      cy.login(mockUser);
      cy.visit('/');
    });

    it('the localStorage value of AUTHENTICATED_HOMEPAGE is "true" and NO_AUTHENTICATED_HOMEPAGE is "true"', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      localStorage.setItem('NO_AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      cy.get('[id="homepage"]').should('be.visible');
      cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on and NO_AUTHENICATED_HOMEPAGE is "true"', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   localStorage.setItem('NO_AUTHENTICATED_HOMEPAGE', true);
    // cy.visit('/');
    //   cy.get('[id="homepage"]').should('be.visible');
    //   cy.get('[data-widget-type="authenticated-homepage"]').should('be.empty');
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
      cy.get('[id="homepage"]').should('not.be.visible');
      cy.get('[data-widget-type="authenticated-homepage"]').should(
        'be.visible',
      );
      cy.get('[data-widget-type="authenticated-homepage"]').should(
        'not.be.empty',
      );
    });

    it('the localStorage value of NO_AUTHENTICATED_HOMEPAGE is flipped twice', () => {
      localStorage.setItem('AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      cy.get('[id="homepage"]').should('not.be.visible');
      localStorage.setItem('NO_AUTHENTICATED_HOMEPAGE', true);
      cy.reload();
      cy.get('[id="homepage"]').should('be.visible');
      localStorage.setItem('NO_AUTHENTICATED_HOMEPAGE', false);
      cy.reload();
      cy.get('[id="homepage"]').should('not.be.visible');
      cy.get('[data-widget-type="authenticated-homepage"]').should(
        'be.visible',
      );
      cy.get('[data-widget-type="authenticated-homepage"]').should(
        'not.be.empty',
      );
    });

    // Uncomment when the feature flag is added to vets-api
    // it('the feature flag is on', () => {
    //   cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    //   cy.get('[id="homepage"]').should('be.empty');
    //   cy.get('[data-widget-type="authenticated-homepage"]').should(
    //     'not.be.empty',
    //   );
    // });
  });
});
