import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import mockFeatureToggles from '../fixtures/feature-toggles.json';

const tryEditSectionWhileEditing = (options) => {
  const { editButtonId, otherSectionEditButtonId, editLineId, sectionName } = options;
  // Open edit view
  cy.get(`#${editButtonId}-edit-link`).click();
  // Make an edit
  cy.get(`#${editLineId}`).click().type('test');
  // Click on a different section to edit
  cy.get(`#${otherSectionEditButtonId}-edit-link`).click();

  // Modal appears
  cy.get('.va-modal').within(() => {
    cy.contains(`You’re currently editing your ${sectionName}`).should('exist');
    cy.findByRole('button', { name: /OK/i }).click();
  });
}

const cancelEdit = (options) => {
  const { editButtonId, editLineId, sectionName } = options;
  // Click on cancel in the current section
  cy.findByRole('button', { name: /Cancel/i }).click();

  // Confirmation modal appears, confirm cancel
  cy.get('.va-modal').within(() => {
    cy.contains(`You haven’t finished editing your ${sectionName}.`).should('exist');
    cy.findByRole('button', { name: /Cancel/i }).click();
  });
}

describe('Users', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login(mockUser);
    // login() calls cy.server() so we can now mock routes
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');

    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');
  });

  it('when editing mailing address', () => {
    tryEditSectionWhileEditing({
      editButtonId: 'mailingAddress',
      otherSectionEditButtonId: 'residentialAddress',
      editLineId: 'root_addressLine3',
      sectionName: 'mailing address',
    })
    cancelEdit({
      editButtonId: 'mailingAddress',
      editLineId: 'root_addressLine3',
      sectionName: 'mailing address',
    })
  });

  it('when editing residential address', () => {
    tryEditSectionWhileEditing({
      editButtonId: 'residentialAddress',
      otherSectionEditButtonId: 'mailingAddress',
      editLineId: 'root_addressLine3',
      sectionName: 'home address',
    })
    cancelEdit({
      editButtonId: 'residentialAddress',
      editLineId: 'root_addressLine3',
      sectionName: 'home address',
    })
  });

  it('when editing home phone', () => {
    tryEditSectionWhileEditing({
      editButtonId: 'homePhone',
      otherSectionEditButtonId: 'mailingAddress',
      editLineId: 'root_extension',
      sectionName: 'home phone number',
    })
    cancelEdit({
      editButtonId: 'homePhone',
      editLineId: 'root_extension',
      sectionName: 'home phone number',
    })
  });

  it('when editing mobile phone', () => {
    tryEditSectionWhileEditing({
      editButtonId: 'mobilePhone',
      otherSectionEditButtonId: 'mailingAddress',
      editLineId: 'root_extension',
      sectionName: 'mobile phone number',
    })
    cancelEdit({
      editButtonId: 'mobilePhone',
      editLineId: 'root_extension',
      sectionName: 'mobile phone number',
    })
  });

  it('when editing email address', () => {
    tryEditSectionWhileEditing({
      editButtonId: 'email',
      otherSectionEditButtonId: 'mailingAddress',
      editLineId: 'root_emailAddress',
      sectionName: 'email address',
    })
    cancelEdit({
      editButtonId: 'email',
      editLineId: 'root_emailAddress',
      sectionName: 'email address',
    })
  });
});


    // const stub = cy.stub()
    // cy.on('window:confirm', stub)
    // cy.contains('Are you sure you want to leave?')
