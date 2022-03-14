import { PROFILE_PATHS } from '@@profile/constants';

import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import transactionCompletedWithNoChanges from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';
import transactionCompletedWithError from '@@profile/tests/fixtures/transactions/error-transaction.json';

const setup = (mobile = false) => {
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
  cy.get(`#${editLineId}`)
    .click({ force: true })
    .type('test', { force: true });

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

const checkRemovalWhileEditingModal = options => {
  const { editSectionName, removalSectionName } = options;

  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit ${editSectionName}`, 'i'),
  }).click({
    force: true,
  });

  // Attempt to remove a different field
  cy.findByRole('button', {
    name: new RegExp(`remove ${removalSectionName}`, 'i'),
  }).click({
    force: true,
  });

  // Modal appears
  cy.get('.va-modal').within(() => {
    cy.contains(`You’re currently editing your ${editSectionName}`).should(
      'exist',
    );
    cy.findByRole('button', { name: /OK/i }).click({
      force: true,
    });
  });

  cy.findByTestId('cancel-edit-button').click({
    force: true,
  });
};

describe('Modals for removal of field', () => {
  it('should show edit notice modal when attempting to remove field after editing another field', () => {
    setup(false);

    checkRemovalWhileEditingModal({
      editSectionName: 'mailing address',
      removalSectionName: 'home address',
    });

    checkRemovalWhileEditingModal({
      editSectionName: 'home phone number',
      removalSectionName: 'mobile phone number',
    });

    checkRemovalWhileEditingModal({
      editSectionName: 'mailing address',
      removalSectionName: 'contact email address',
    });

    cy.axeCheck();
  });
});

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

describe('Modals on the personal information and content page after editing', () => {
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

describe('when moving to other profile sections', () => {
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
      // using force: true since there are times when the click does not
      // register and the bank info form does not open
      force: true,
    });
    cy.findByRole('link', {
      name: /personal.*information/i,
    }).click({
      // using force: true since there are times when the click does not
      // register and the bank info form does not open
      force: true,
    });
    cy.findByRole('button', {
      name: new RegExp(`edit ${sectionName}`, 'i'),
    }).should('exist');

    cy.axeCheck();
  });
});

describe('Modals on the personal information and content page when they error', () => {
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
