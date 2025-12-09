import * as utils from '../utils';

describe.skip('Medical Expense Report Form 8416', () => {
  describe('Veteran reporting medical expenses', () => {
    before(() => {
      utils.startApplicationWithoutLogin();
    });

    it('tests Veteran reporting medical expenses path', () => {
      // Applicant Information identity
      utils.checkContentAnonymousApplicantInformationIdentity();
      cy.selectRadio('root_claimantNotVeteran', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Applicant Information name
      utils.checkContentAnonymousApplicantInformationName();
      utils.fillInNameFromFixture();
      utils.checkContentAnonymousApplicantInformationMailingAddress();
      utils.fillInFullAddressFromFixture();
      utils.checkContentAnonymousApplicantInformationEmail();

      utils.fillInEmailAndPhoneFromFixture();
      utils.checkContentAnonymousApplicantInformationSSN();
      utils.fillInVetInfoWithoutNameSSNFromFixture();

      // Reporting period
      utils.checkContentAnonymousReportingPeriod();
      cy.selectRadio('root_firstTimeReporting', 'Y');
      utils.checkAxeAndClickContinueButton();

      utils.checkAxeAndClickContinueButton();

      // Care Expenses
      utils.fillInCareExpensesFromFixture();
      cy.selectRadio('root_view:careExpensesList', 'N');
      utils.checkAxeAndClickContinueButton();

      // Medical Expenses
      utils.fillInMedicalExpensesFromFixture();
      cy.selectRadio('root_view:medicalExpensesList', 'N');
      utils.checkAxeAndClickContinueButton();

      // Milage Expenses
      utils.fillInMilageExpensesFromFixture();
      cy.selectRadio('root_view:mileageExpensesList', 'N');

      utils.checkAxeAndClickContinueButton();
      cy.contains('Supporting documents');
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
});
