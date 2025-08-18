import { makeUserObject } from '~/applications/personalization/common/helpers';
import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import mockGet from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-200.json';
import mockPatch from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-patch.json';
import mockPatchAllowed from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-patch-allowed.json';
import { PROFILE_PATHS } from '@@profile/constants';

describe('Paperless Delivery', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowPaperlessDelivery: true,
      }),
    );
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      body: mockGet,
      statusCode: 200,
    }).as('paperlessGet');
  });

  context('when user is enrolled in health care', () => {
    beforeEach(() => {
      cy.login(
        makeUserObject({
          isPatient: true,
          facilities: [{ facilityId: '999' }],
        }),
      );
      cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    });

    it('allows user to toggle opt-in for paperless delivery', () => {
      cy.intercept('PATCH', '/v0/profile/communication_preferences/82064', {
        body: mockPatchAllowed,
        delay: 500,
        statusCode: 200,
      }).as('paperlessPatchAllowed');
      cy.findByRole('heading', { name: 'Paperless delivery', level: 1 }).should(
        'be.visible',
      );
      cy.findByRole('heading', {
        name: 'Documents available for paperless delivery',
        level: 2,
      }).should('be.visible');
      cy.get('va-checkbox')
        .first()
        .as('paperlessOption');
      cy.get('@paperlessOption')
        .shadow()
        .find('input[type="checkbox"]')
        .should('exist')
        .and('not.be.checked');
      cy.get('@paperlessOption')
        .shadow()
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.wait('@paperlessPatchAllowed');
      cy.get('va-alert')
        .should('be.visible')
        .and('contain.text', 'Update saved');
      cy.get('@paperlessOption')
        .shadow()
        .find('input[type="checkbox"]')
        .should('be.checked');
      cy.intercept('PATCH', '/v0/profile/communication_preferences/82064', {
        body: mockPatch,
        delay: 500,
        statusCode: 200,
      }).as('paperlessPatch');
      cy.get('@paperlessOption')
        .shadow()
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.wait('@paperlessPatchAllowed');
      cy.get('va-alert')
        .should('be.visible')
        .and('contain.text', 'Update saved');
      cy.get('@paperlessOption')
        .shadow()
        .find('input[type="checkbox"]')
        .should('exist')
        .and('not.be.checked');
      cy.axeCheck();
    });
  });

  context('when user is not enrolled in health care', () => {
    beforeEach(() => {
      cy.login(
        makeUserObject({
          isPatient: true,
          facilities: [],
        }),
      );
      cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    });

    it('displays alert - not available yet', () => {
      cy.findByRole('heading', { name: 'Paperless delivery', level: 1 }).should(
        'be.visible',
      );
      cy.get('va-alert')
        .should('contain.text', 'Paperless delivery not available yet')
        .and(
          'contain.text',
          'You’re not enrolled in any VA benefits that offer paperless delivery options',
        )
        .and('be.visible');
      cy.axeCheck();
    });
  });
});
