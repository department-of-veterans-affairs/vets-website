import { USER_MOCK_DATA } from '../../constants/mockData';
import { mockUser } from './login';

describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1', USER_MOCK_DATA).as('getData');
    cy.visit('/education/verify-your-enrollment/');
    cy.wait('@getData');
  });
  it('should show Dirct deposit infromation', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get(
      '[class="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold"]',
    ).should('contain', 'Direct deposit information');
  });
  it('should open bank info form when Add or update account buttton is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
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
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
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
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('input[id="root_GI-Bill-Chapters-phone"]').type('4082037901');
    cy.get(
      'label[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]',
    ).click();
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.get('[id="root_GI-Bill-Chapters-fullName-error-message"]').should(
      'contain',
      "Please enter the Veteran's Full Name",
    );
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
    cy.login() || cy.login(mockUser);
    cy.intercept('POST', `/vye/v1/bank_info`, {
      statusCode: 200,
      ok: true,
    }).as('updateDirectDeposit');
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('[id="root_GI-Bill-Chapters-fullName"]').type('John Smith');
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
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.wait('@updateDirectDeposit');
    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and('contain.text', 'Your direct deposit information has been updated.');
  });
  it('Should submit error if all required fields all not empty but something was wrong with the API', () => {
    cy.injectAxeThenAxeCheck();
    cy.login() || cy.login(mockUser);
    cy.intercept('POST', `/vye/v1/bank_info`, {
      statusCode: 401,
    }).as('updateDirectDeposit');
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('[id="root_GI-Bill-Chapters-fullName"]').type('John Smith');
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
});
