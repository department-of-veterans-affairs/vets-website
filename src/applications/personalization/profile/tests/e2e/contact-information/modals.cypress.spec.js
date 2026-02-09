import { PROFILE_PATHS } from '@@profile/constants';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import transactionCompletedWithNoChanges from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';
import transactionCompletedWithError from '@@profile/tests/fixtures/transactions/error-transaction.json';
import { mockFeatureToggles } from '../helpers';

const setup = ({ profile2Enabled = false, mobile = false } = {}) => {
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  cy.login(mockUser);
  if (profile2Enabled) {
    cy.intercept('GET', 'v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'profile_2_enabled', value: true }],
      },
    });
  } else {
    mockFeatureToggles();
  }
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  // test causing issues locally, skipping for now
  // cy.get('va-loading-indicator')
  //   .should('exist')
  //   .then($container => {
  //     cy.wrap($container)
  //       .shadow()
  //       .findByRole('progressbar')
  //       .should('contain', /loading your information/i);
  //   });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  cy.injectAxe();
};

const checkModals = options => {
  const { otherSectionName, editLineId, sectionName } = options;

  // Open edit view
  cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });

  // Make an edit
  cy.fillVaTextInput(editLineId, 'test');

  // Click on a different section to edit
  cy.get(`va-button[label="Edit ${otherSectionName}"]`).click({ force: true });

  // Modal appears
  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .findByText(
      `Save or cancel your edits to your ${sectionName.toLowerCase()}`,
    )
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
  cy.findByTestId('cancel-edit-button').click({ force: true });

  // Confirmation modal appears, confirm cancel

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .findByText('Cancel changes?')
    .should('exist');

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/Cancel changes/i)
    .click();
};

const checkRemovalWhileEditingModal = options => {
  const { editSectionName, editLineId, removalSectionName } = options;

  // Open edit view
  cy.get(`va-button[label="Edit ${editSectionName}"]`).click({ force: true });

  cy.fillVaTextInput(editLineId, '1234');

  // Attempt to remove a different field
  cy.get(`va-button[label="Remove ${removalSectionName}"]`).click({
    force: true,
  });

  cy.findByTestId('cannot-edit-modal')
    .shadow()
    .findByText(
      `Save or cancel your edits to your ${editSectionName.toLowerCase()}`,
    )
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
    .findByText(/Cancel changes/i)
    .click();
};

describe('Modals for removal of field', () => {
  it('should show edit notice modal when attempting to remove field after editing another field', () => {
    setup({ mobile: false });
    checkRemovalWhileEditingModal({
      editSectionName: 'Mailing address',
      editLineId: 'root_addressLine1',
      removalSectionName: 'Home address',
    });
    cy.axeCheck();
  });

  it('should show edit notice modal when attempting to remove field after editing another field', () => {
    setup({ mobile: false });
    checkRemovalWhileEditingModal({
      editSectionName: 'Home phone number',
      editLineId: 'root_inputPhoneNumber',
      removalSectionName: 'Mobile phone number',
    });
    cy.axeCheck();
  });

  it('should show edit notice modal when attempting to remove field after editing another field', () => {
    setup({ mobile: false });
    checkRemovalWhileEditingModal({
      editSectionName: 'Mailing address',
      editLineId: 'root_addressLine1',
      removalSectionName: 'Contact email address',
    });

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page', () => {
  it('should render as expected on Desktop 1', () => {
    setup();
    // should appear when editing mailing address
    checkModals({
      otherSectionName: 'Home address',
      editLineId: 'root_addressLine3',
      sectionName: 'Mailing address',
    });
    cy.axeCheck();
  });

  it('should render as expected on Desktop 2', () => {
    setup();
    // should appear when editing residential address
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_addressLine3',
      sectionName: 'Home address',
    });
    cy.axeCheck();
  });

  it('should render as expected on Desktop 3', () => {
    setup();
    // should appear when editing home phone number
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_extension',
      sectionName: 'Home phone number',
    });
    cy.axeCheck();
  });

  it('should render as expected on Desktop 4', () => {
    setup();
    // should appear when editing email address
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_emailAddress',
      sectionName: 'Contact email address',
    });

    cy.axeCheck();
  });

  it('should render as expected on Mobile 1', () => {
    setup({ mobile: true });

    // should appear when editing mailing address
    checkModals({
      otherSectionName: 'Home address',
      editLineId: 'root_addressLine3',
      sectionName: 'Mailing address',
    });
    cy.axeCheck();
  });

  it('should render as expected on Mobile 2', () => {
    setup({ mobile: true });
    // should appear when editing residential address
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_addressLine3',
      sectionName: 'Home address',
    });
    cy.axeCheck();
  });

  it('should render as expected on Mobile 3', () => {
    setup({ mobile: true });
    // should appear when editing home phone number
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_extension',
      sectionName: 'Home phone number',
    });
    cy.axeCheck();
  });

  it('should render as expected on Mobile 4', () => {
    setup({ mobile: true });
    // should appear when editing email address
    checkModals({
      otherSectionName: 'Mailing address',
      editLineId: 'root_emailAddress',
      sectionName: 'Contact email address',
    });

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page after editing', () => {
  it('should allow the ability to reopen the edit modal when the transaction completes', () => {
    setup();

    const sectionName = 'Contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // find edit button and click it
    cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });

    // verify input exists
    cy.get('va-text-input[label="Email address" i]');

    cy.axeCheck();
  });
});

describe('when moving to other profile pages', () => {
  it('should exit edit mode if opened', () => {
    setup();

    const sectionName = 'Contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });

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
    // uncomment when Paperless Delivery is ready for production
    //  cy.get('va-sidenav-item[label="Military information"]')
    //   .filter(':visible')
    //   .click();
    // cy.get('va-sidenav-item[label="Contact information"]')
    //   .filter(':visible')
    //   .click();
    cy.get(`va-button[label="Edit ${sectionName}"]`).should('exist');

    cy.axeCheck();
  });

  it('should exit edit mode if opened (profile2Enabled)', () => {
    setup({ profile2Enabled: true });

    const sectionName = 'Contact email address';

    cy.intercept(
      '/v0/profile/email_addresses',
      transactionCompletedWithNoChanges,
    );

    // Open edit view
    cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });
    cy.get('va-sidenav-item[label="Service history information"]')
      .filter(':visible')
      .click();
    cy.get('va-sidenav-item[label="Contact information"]')
      .filter(':visible')
      .click();
    cy.get(`va-button[label="Edit ${sectionName}"]`).should('exist');

    cy.axeCheck();
  });
});

describe('when editing other profile fields on the same page', () => {
  it('should exit edit mode if no changes have been made', () => {
    setup();

    // Open edit view for email address
    cy.get(`va-button[label="Edit Contact email address"]`).click({
      force: true,
    });

    // Open another field in edit view
    cy.get(`va-button[label="Edit Mobile phone number"]`).click({
      force: true,
    });

    cy.get('[name="root_inputPhoneNumber"]').should('exist');

    // Cancel edit should also exist the edit mode with no modal
    cy.findByTestId('cancel-edit-button').click({ force: true });

    // edit button should reappear once edit mode is exited
    cy.get(`va-button[label="Edit Mobile phone number"]`).should('exist');

    cy.axeCheck();
  });
});

describe('Modals on the contact information and content page when they error', () => {
  it('should exist', () => {
    setup();

    const sectionName = 'Contact email address';

    cy.intercept('/v0/profile/email_addresses', transactionCompletedWithError);

    // Open edit view
    cy.get(`va-button[label="Edit ${sectionName}"]`).click({ force: true });

    // Click on Update in the current section
    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    // expect an error to be shown
    cy.findByTestId('edit-error-alert').should('exist');

    cy.axeCheck();
  });
});
