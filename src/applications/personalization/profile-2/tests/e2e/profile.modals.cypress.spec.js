import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import mockFeatureToggles from '../fixtures/feature-toggles.json';

const setup = (mobile = false) => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

  if (mobile) {
    cy.viewport('iphone-4');
  }

  cy.login(mockUser);
  cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
}

const checkModals = options => {
  const {
    editButtonId,
    otherSectionEditButtonId,
    editLineId,
    sectionName,
  } = options;

  // Open edit view
  cy.get(`#${editButtonId}-edit-link`).click({
    force: true,
  });
  // Make an edit
  cy.get(`#${editLineId}`)
    .click()
    .type('test');
  // Click on a different section to edit
  cy.get(`#${otherSectionEditButtonId}-edit-link`).click({
    force: true,
  });

  // Modal appears
  cy.get('.va-modal').within(() => {
    cy.contains(`You’re currently editing your ${sectionName}`).should('exist');
    cy.findByRole('button', { name: /OK/i }).click({
      force: true,
    });
  });

  // Click on cancel in the current section
  cy.findByRole('button', { name: /Cancel/i }).click({
    force: true,
  });

  // Confirmation modal appears, confirm cancel
  cy.get('.va-modal').within(() => {
    cy.contains(`You haven’t finished editing your ${sectionName}.`).should(
      'exist',
    );
    cy.findByRole('button', { name: /Cancel/i }).click({
      force: true,
    });
  });
};

describe('Modals on the personal information and content page', () => {
  describe('on Desktop', () => {
    beforeEach(() => {
      setup();
    });

    it('should appear when editing mailing address', () => {
      checkModals({
        editButtonId: 'mailingAddress',
        otherSectionEditButtonId: 'residentialAddress',
        editLineId: 'root_addressLine3',
        sectionName: 'mailing address',
      });
    });

    it('should appear when editing residential address', () => {
      checkModals({
        editButtonId: 'residentialAddress',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_addressLine3',
        sectionName: 'home address',
      });
    });

    it('should appear when editing home phone number', () => {
      checkModals({
        editButtonId: 'homePhone',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_extension',
        sectionName: 'home phone number',
      });
    });

    it('should appear when editing mobile phone number', () => {
      checkModals({
        editButtonId: 'mobilePhone',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_extension',
        sectionName: 'mobile phone number',
      });

    });

    it('should appear when editing email address', () => {
      checkModals({
        editButtonId: 'email',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_emailAddress',
        sectionName: 'email address',
      });
    });
  });

  describe('on Mobile', () => {
    beforeEach(() => {
      setup(true);
    });

    it('should appear when editing mailing address', () => {
      checkModals({
        editButtonId: 'mailingAddress',
        otherSectionEditButtonId: 'residentialAddress',
        editLineId: 'root_addressLine3',
        sectionName: 'mailing address',
      });
    });

    it('should appear when editing residential address', () => {
      checkModals({
        editButtonId: 'residentialAddress',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_addressLine3',
        sectionName: 'home address',
      });
    });

    it('should appear when editing home phone number', () => {
      checkModals({
        editButtonId: 'homePhone',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_extension',
        sectionName: 'home phone number',
      });
    });

    it('should appear when editing mobile phone number', () => {
      checkModals({
        editButtonId: 'mobilePhone',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_extension',
        sectionName: 'mobile phone number',
      });
    });

    it('should appear when editing email address', () => {
      checkModals({
        editButtonId: 'email',
        otherSectionEditButtonId: 'mailingAddress',
        editLineId: 'root_emailAddress',
        sectionName: 'email address',
      });
    });
  });
});
