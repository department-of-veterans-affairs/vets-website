import { mockUser, mockUserWithOutIDME } from './login';

describe('Direct deposit information', () => {
  /**
   *
   * @param {object} win
   */
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/vye/v1', { statusCode: 200 });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'toggle_vye_application', value: true },
          { name: 'toggle_vye_address_direct_deposit_forms', value: true },
          { name: 'mgib_verifications_maintenance', value: false },
        ],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('/education/verify-school-enrollment/mgib-enrollments/');
  });
  const fillForm = () => {
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('input[id="root_GI-Bill-Chapters-phone"]').type('4082037901');
    cy.get('[id="root_GI-Bill-Chapters-email"]').type('uer01@mail.com');
    cy.get(
      'label[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]',
    ).click();
    cy.get('[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]').click();
    cy.get('[id="root_GI-Bill-Chapters-BankName"]').type('Bank Of America');
    cy.get('[id="root_GI-Bill-Chapters-BankPhone"]').type('3155682345');
    cy.get('[id="root_GI-Bill-Chapters-RoutingNumber"]').type('938235879');
    cy.get('[id="root_GI-Bill-Chapters-AccountNumber"]').type('00026643207');
    cy.get('[id="root_GI-Bill-Chapters-VerifyAccountNumber"]').type(
      '00026643207',
    );
  };
  it('should show Dirct deposit infromation', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[class="vads-u-font-family--serif vads-u-margin-y--4"]').should(
      'contain',
      'Direct deposit information',
    );
  });
  it('should open bank info form when "Add or change account" buttton is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get(
      '[alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."]',
    ).should('exist');
    cy.get('[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]').should(
      'contain',
      'Checking',
    );
  });
  it('should close the form when Cancel button is clicked ', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get(
      '[aria-label="cancel updating your bank information for GI Bill® benefits"]',
    ).click();
    cy.get('[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]').should(
      'not.exist',
    );
  });
  it('should show show errors when save button is clicked and some or all of the required fields empty ', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('input[id="root_GI-Bill-Chapters-phone"]').type('4082037901');
    cy.get(
      'label[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]',
    ).click();
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.get('[id="root_GI-Bill-Chapters-email-error-message"]').should(
      'contain',
      'Please enter an email address',
    );
    cy.get('[id="root_GI-Bill-Chapters-BankName-error-message"]').should(
      'contain',
      'Please enter the name of your Financial Institution',
    );
  });
  it('Should submit without any errors if all required fields all not empty', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/vye/v1/bank_info`, {
      statusCode: 200,
      ok: true,
    }).as('updateDirectDeposit');

    fillForm();
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.wait('@updateDirectDeposit');
    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'We’ve updated your direct deposit information for Montgomery GI Bill benefits.',
      );
  });
  it('Should submit error if all required fields all not empty but something was wrong with the API', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/vye/v1/bank_info`, {
      statusCode: 401,
    }).as('updateDirectDeposit');
    fillForm();
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.wait('@updateDirectDeposit');
    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Sorry, something went wrong. Please try again Later',
      );
  });
  it('should show warning alert if user hits cancel after editing form', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get('va-button[secondary]').click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
  });
  it('should show warning alert if user hits cancel after editing form and it should go back to thr form when user clicks "No, go back to editing" button', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get('va-button[secondary]').click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
    cy.get('va-button')
      .last()
      .click({ force: true });
    cy.get('[id="root_GI-Bill-Chapters-email-label"]').should(
      'contain',
      "Veteran's email address",
    );
  });
  it('should show warning alert if user hits cancel after editing form and it should close alert and form when user clicks Yes, cancel my changes', () => {
    cy.injectAxeThenAxeCheck();
    fillForm();
    cy.get('va-button[secondary]').click();
    cy.get('h2[class="usa-modal__heading va-modal-alert-title"]').should(
      'contain',
      'Are you sure?',
    );
    cy.get('va-button')
      .first()
      .click();
  });
  it('should not show Direct Dopist form if user loggedin without using ID.me', () => {
    cy.injectAxeThenAxeCheck();
    cy.login(mockUserWithOutIDME);
    cy.get(
      '[href="/education/verify-school-enrollment/mgib-enrollments/benefits-profile/"]',
    )
      .first()
      .click();
    cy.get('[data-testid="direct-deposit-mfa-message"]').should(
      'contain',
      'Before we give you access to change your direct deposit information, we need to make sure you’re you—and not someone pretending to be you. This helps us protect your bank account and prevent fraud.',
    );
  });
});
