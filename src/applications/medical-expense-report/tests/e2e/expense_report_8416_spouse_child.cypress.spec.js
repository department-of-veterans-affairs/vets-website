// import * as utils from '../utils';

describe('Spouse or Child of Veteran medical expenses path', () => {
  // before(() => {
  //   utils.startApplicationWithoutLogin();
  // });
  beforeEach(() => {
    cy.visit(
      '/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416',
    );
  });

  it('tests Veteran Spouse reporting medical expenses path', () => {
    cy.findByRole('heading', { level: 1 }).should(
      'have.text',
      'Submit medical expenses to support a pension or DIC claim',
    );
    cy.findByRole('heading', {
      level: 2,
      name: 'Follow these steps to get started:',
    }).should('exist');
    cy.findByText('What to know before you fill out this form').should('exist');
    // cy.findByText('Sign in to start your application').should('exist');
    cy.get('va-alert-sign-in')
      .get('a[class="schemaform-start-button"]')
      .should('exist');
    // checkVisibleElementContent(
    //   'h1',
    //   'Submit medical expenses to support a pension or DIC claim',
    // );
    // checkVisibleElementContent('h2', 'Follow these steps to get started:');
    // checkVisibleElementContent(
    //   'va-process-list',
    //   'What to know before you fill out this form',
    // );
    // checkVisibleElementContent(
    //   'va-alert-sign-in',
    //   'Sign in with a verified account',
    // );
    cy.injectAxeThenAxeCheck();
    // cy.selectRadio('root_claimantNotVeteran', 'N');
    // utils.checkAxeAndClickContinueButton();

    // utils.fillInNameFromFixture();
    // utils.fillInFullAddressFromFixture();

    // utils.fillInEmailAndPhoneFromFixture();

    // utils.fillInVetInfoWithNameSSNFromFixture();

    // // Reporting period
    // cy.selectRadio('root_firstTimeReporting', 'Y');
    // utils.checkAxeAndClickContinueButton();

    // utils.fillInCareExpensesFromFixture();

    // cy.selectRadio('root_view:careExpensesList', 'N');
    // utils.checkAxeAndClickContinueButton();

    // // Medical expenses
    // utils.fillInMedicalExpensesFromFixture();

    // cy.selectRadio('root_view:medicalExpensesList', 'N');
    // utils.checkAxeAndClickContinueButton();

    // // Milage expenses
    // utils.fillInMilageExpensesFromFixture();

    // cy.selectRadio('root_view:mileageExpensesList', 'N');
    // utils.checkAxeAndClickContinueButton();

    // utils.checkAxeAndClickContinueButton();

    // cy.contains('Upload your supporting documents');
    // // No supporting documents yet
    // // utils.uploadTestFiles();  TODO: Mock the response for file uploads
    // utils.checkAxeAndClickContinueButton();

    // // Statement of Truth
    // cy.injectAxeThenAxeCheck();
    // utils.fillInStatementOfTruthFromFixture();
  });
});
