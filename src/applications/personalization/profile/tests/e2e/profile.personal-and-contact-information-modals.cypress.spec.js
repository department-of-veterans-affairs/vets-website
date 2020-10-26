import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';

const setup = (mobile = false) => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

  if (mobile) {
    cy.viewport('iphone-4');
  }

  cy.login(mockUser);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

const checkModals = options => {
  const { otherSectionName, editLineId, sectionName } = options;

  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit ${sectionName}`, 'i'),
  }).click({
    force: true,
  });

  // confirm that the update button is disabled before a change is made
  cy.findByRole('button', { name: 'Update' }).should('be.disabled');

  // Make an edit
  cy.get(`#${editLineId}`)
    .click()
    .type('test');

  // confirm that the update button is enabled
  cy.findByRole('button', { name: 'Update' }).should('not.be.disabled');

  // Click on a different section to edit
  cy.findByRole('button', {
    name: new RegExp(`edit ${otherSectionName}`, 'i'),
  }).click({
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
  it('should render as expected on Desktop', () => {
    setup();

    // should appear when editing mailing address
    checkModals({
      otherSectionName: 'home address',
      editLineId: 'root_addressLine3',
      sectionName: 'mailing address',
    });

    // should appear when editing residential address
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_addressLine3',
      sectionName: 'home address',
    });

    // should appear when editing home phone number
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_extension',
      sectionName: 'home phone number',
    });

    // should appear when editing mobile phone number
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_extension',
      sectionName: 'mobile phone number',
    });

    // should appear when editing email address
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_emailAddress',
      sectionName: 'email address',
    });
  });

  it('should render as expected on Mobile', () => {
    setup(true);

    // should appear when editing mailing address
    checkModals({
      otherSectionName: 'home address',
      editLineId: 'root_addressLine3',
      sectionName: 'mailing address',
    });

    // should appear when editing residential address
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_addressLine3',
      sectionName: 'home address',
    });

    // should appear when editing home phone number
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_extension',
      sectionName: 'home phone number',
    });

    // should appear when editing mobile phone number
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_extension',
      sectionName: 'mobile phone number',
    });

    // should appear when editing email address
    checkModals({
      otherSectionName: 'mailing address',
      editLineId: 'root_emailAddress',
      sectionName: 'email address',
    });
  });
});
