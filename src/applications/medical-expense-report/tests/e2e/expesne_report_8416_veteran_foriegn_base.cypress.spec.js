import * as utils from '../utils';

describe('Veteran reporting medical expenses path on foreign base', () => {
  before(() => {
    utils.startApplicationWithoutLogin();
  });

  it('tests Veteran reporting medical expenses path', () => {
    cy.selectRadio('root_claimantNotVeteran', 'N');
    utils.checkAxeAndClickContinueButton();

    utils.fillInNameFromFixture();
    utils.fillInMilBaseAddressFromFixture();

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

    cy.contains('Submit your supporting documents');
    // No supporting documents yet
    utils.checkAxeAndClickContinueButton();

    // Statement of Truth
    utils.fillInStatementOfTruthFromFixture();
    cy.injectAxeThenAxeCheck();
  });
});
