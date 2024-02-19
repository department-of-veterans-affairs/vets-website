import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user';
import transactionCompletedWithNoChanges from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';
import transactionCompletedWithError from '@@profile/tests/fixtures/transactions/error-transaction.json';
import { mockFeatureToggles } from '../helpers';

const setup = (mobile = false) => {
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  cy.login(mockUser);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  cy.injectAxe();
};

const checkModals = options => {
  const { otherSectionName, editLineId, sectionName } = options;

  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit ${sectionName}`, 'i'),
  }).click({
    force: true,
  });

  // Make an edit
  cy.get(`#${editLineId}`).click({ force: true });

  cy.get(`#${editLineId}`).type('test', { force: true });

  // Click on a different section to edit
  cy.findByRole('button', {
    name: new RegExp(`edit ${otherSectionName}`, 'i'),
  }).click({
    force: true,
  });

  // Modal appears
  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .findByText(`Save or cancel your edits to your ${sectionName}`)
    .should('exist');

  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/ok/i)
    .click();

  // Click on cancel in the current section
  cy.findByRole('button', { name: /Cancel/i }).click({
    force: true,
  });

  // Confirmation modal appears, confirm cancel

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .findByText('Are you sure?')
    .should('exist');

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/yes, cancel my changes/i)
    .click();
};

const checkRemovalWhileEditingModal = options => {
  const { editSectionName, editLineId, removalSectionName } = options;

  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit ${editSectionName}`, 'i'),
  }).click({
    force: true,
  });

  cy.get(`#${editLineId}`).type('{selectAll}{backspace}1234', { force: true });

  // Attempt to remove a different field
  cy.findByRole('button', {
    name: new RegExp(`remove ${removalSectionName}`, 'i'),
  }).click({
    force: true,
  });

  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .findByText(`Save or cancel your edits to your ${editSectionName}`)
    .should('exist');

  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/ok/i)
    .click();

  cy.findByTestId('cancel-edit-button').click();

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/yes, cancel my changes/i)
    .click();
};

describe('Modals for removal of field', () => {
  it('should show edit notice modal when attempting to remove field after editing another field', () => {
    setup(false);

    checkRemovalWhileEditingModal({
      editSectionName: 'mailing address',
      editLineId: 'root_addressLine1',
      removalSectionName: 'home address',
    });

    checkRemovalWhileEditingModal({
      editSectionName: 'home phone number',
      editLineId: 'root_inputPhoneNumber',
      removalSectionName: 'mobile phone number',
    });

    checkRemovalWhileEditingModal({
      editSectionName: 'mailing address',
      editLineId: 'root_addressLine1',
      removalSectionName: 'contact email address',
    });

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page', () => {
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
      sectionName: 'contact email address',
    });

    cy.axeCheck();
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
      sectionName: 'contact email address',
    });

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page after editing', () => {
  it('should allow the ability to reopen the edit modal when the transaction completes', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // find edit button and click it
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // verify input exists
    cy.findByLabelText(/email address/i);

    cy.axeCheck();
  });
});

describe('when moving to other profile pages', () => {
  it('should exit edit mode if opened', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    cy.findByRole('link', {
      name: /military information/i,
    }).click({
      force: true,
    });
    cy.findByRole('link', {
      name: /contact.*information/i,
    }).click({
      force: true,
    });
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).should('exist');

    cy.axeCheck();
  });
});

describe('when editing other profile fields on the same page', () => {
  it('should exit edit mode if no changes have been made', () => {
    setup();

    // Open edit view for email address
    cy.findByRole('button', {
      name: new RegExp(`edit contact email address`, 'i'),
    }).click({
      force: true,
    });

    // Open another field in edit view
    cy.findByRole('button', {
      name: new RegExp(`edit mobile phone number`, 'i'),
    }).click({
      force: true,
    });

    cy.get('#root_inputPhoneNumber').should('exist');

    // Cancel edit should also exist the edit mode with no modal
    cy.findByRole('button', {
      name: /Cancel/i,
    }).click({
      force: true,
    });

    // edit button should reappear once edit mode is exited
    cy.findByRole('button', {
      name: new RegExp(`edit mobile phone number`, 'i'),
    }).should('exist');

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page when they error', () => {
  it('should exist', () => {
    setup();

    const sectionName = 'contact email address';

    cy.intercept('/v0/profile/email_addresses', transactionCompletedWithError);

    // Open edit view
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).click({
      force: true,
    });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // expect an error to be shown
    cy.findByTestId('edit-error-alert').should('exist');

    cy.axeCheck();
  });
});
