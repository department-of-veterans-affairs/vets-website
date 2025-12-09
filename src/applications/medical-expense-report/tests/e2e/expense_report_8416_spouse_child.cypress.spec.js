import * as utils from '../utils';

describe('Spouse or Child of Veteran medical expenses path', () => {
  before(() => {
    utils.startApplicationWithoutLogin();
  });

  it('tests Veteran Spouse reporting medical expenses path', () => {
    cy.selectRadio('root_claimantNotVeteran', 'N');
    utils.checkAxeAndClickContinueButton();

    utils.fillInNameFromFixture();
    utils.fillInFullAddressFromFixture();

    utils.fillInEmailAndPhoneFromFixture();

    utils.fillInVetInfoWithNameSSNFromFixture();

    // Reporting period
    cy.selectRadio('root_firstTimeReporting', 'Y');
    utils.checkAxeAndClickContinueButton();

    utils.fillInCareExpensesFromFixture();

    cy.selectRadio('root_view:careExpensesList', 'N');
    utils.checkAxeAndClickContinueButton();

    // Medical expenses
    utils.fillInMedicalExpensesFromFixture();

    cy.selectRadio('root_view:medicalExpensesList', 'N');
    utils.checkAxeAndClickContinueButton();

    // Milage expenses
    utils.fillInMilageExpensesFromFixture();

    cy.selectRadio('root_view:mileageExpensesList', 'N');
    utils.checkAxeAndClickContinueButton();

    utils.checkAxeAndClickContinueButton();

    cy.contains('Upload your supporting documents');
    // No supporting documents yet
    // utils.uploadTestFiles();  TODO: Mock the response for file uploads
    utils.checkAxeAndClickContinueButton();

    // Statement of Truth
    cy.injectAxeThenAxeCheck();
    utils.fillInStatementOfTruthFromFixture();
  });
});
