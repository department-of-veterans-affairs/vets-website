import { makeUserObject } from '~/applications/personalization/common/helpers';
import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import mockGet from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-200.json';
import mockGetAllowed from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-200-allowed.json';
import mockPatch from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-patch.json';
import mockPatchAllowed from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-patch-allowed.json';
import { PROFILE_PATHS } from '@@profile/constants';
import { mockNotificationSettingsAPIs } from '../helpers';

// Skipping as Paperless Delivery is delayed and
// this code might be removed before it goes live.
describe.skip('Paperless Delivery', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs(
      generateFeatureToggles({
        profileShowPaperlessDelivery: true,
      }),
    );
  });

  it('allows user to enroll in paperless delivery', () => {
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      body: mockGet,
      statusCode: 200,
    }).as('paperlessGet');
    cy.login(
      makeUserObject({
        facilities: [{ facilityId: '123' }],
        isPatient: true,
      }),
    );
    cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    cy.get('va-checkbox')
      .first()
      .as('paperlessOption');
    cy.get('@paperlessOption')
      .shadow()
      .find('input[type="checkbox"]')
      .should('exist')
      .and('not.be.checked');
    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      body: mockPatchAllowed,
      delay: 500,
      statusCode: 200,
    }).as('paperlessPatchAllowed');
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
    cy.injectAxeThenAxeCheck();
  });

  it('allows user to unenroll from paperless delivery', () => {
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      body: mockGetAllowed,
      statusCode: 200,
    }).as('paperlessGet');
    cy.login(
      makeUserObject({
        facilities: [{ facilityId: '123' }],
        isPatient: true,
      }),
    );
    cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    cy.get('va-checkbox')
      .first()
      .as('paperlessOption');
    cy.get('@paperlessOption')
      .shadow()
      .find('input[type="checkbox"]')
      .should('exist')
      .and('be.checked');
    cy.intercept('PATCH', '/v0/profile/communication_preferences/*', {
      body: mockPatch,
      delay: 500,
      statusCode: 200,
    }).as('paperlessPatch');
    cy.get('@paperlessOption')
      .shadow()
      .find('input[type="checkbox"]')
      .click({ force: true });
    cy.wait('@paperlessPatch');
    cy.get('va-alert')
      .should('be.visible')
      .and('contain.text', 'Update saved');
    cy.get('@paperlessOption')
      .shadow()
      .find('input[type="checkbox"]')
      .should('exist')
      .and('not.be.checked');
    cy.injectAxeThenAxeCheck();
  });

  it('displays alert when user is not enrolled in benefits that offer paperless delivery', () => {
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      body: mockGet,
      statusCode: 200,
    }).as('paperlessGet');
    cy.login(
      makeUserObject({
        facilities: [],
        isPatient: true,
      }),
    );
    cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    cy.get('va-alert')
      .should('contain.text', 'Paperless delivery not available yet')
      .and(
        'contain.text',
        'You’re not enrolled in any VA benefits that offer paperless delivery options',
      )
      .and('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays alert when user does not have a profile email address', () => {
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      body: mockGet,
      statusCode: 200,
    }).as('paperlessGet');
    cy.login(
      makeUserObject({
        contactInformation: {},
        facilities: [{ facilityId: '123' }],
        isPatient: true,
      }),
    );
    cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    cy.get('va-alert')
      .should(
        'contain.text',
        'Add your email to get notified when documents are ready',
      )
      .and(
        'contain.text',
        'You don’t have an email address in your VA profile. If you add one, we’ll email you when your documents are ready.',
      )
      .and('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
