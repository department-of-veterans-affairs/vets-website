import * as utils from '../utils';

describe('Survivor Pension Benefits 534EZ ', () => {
  describe('Surviving Spoust with children no pension', () => {
    Cypress.config({
      defaultCommandTimeout: 20000,
      requestTimeout: 20000,
      taskTimeout: 30000,
      waitForAnimations: true,
    });

    before(() => {
      utils.startApplicationWithoutLogin();
    });
    it('tests reporting survivor expenses path DIC No Clildren', () => {
      utils.checkContentNameDobPage();
      utils.fillInNameFromFixture();

      utils.checkContentVetInfoSSN();
      utils.fillInSsnFromFixture();

      utils.checkContentAdditionalVetsInfo();
      utils.fillInVetInformationFromFixture();

      utils.checkContentClaimantsRelationship();
      utils.fillInClaimantsRelationshipDataFromFixture();
      utils.checkAxeAndClickContinueButton();

      utils.checkContentClaimantsAddress();
      utils.fillInClaimantsAddressFromFixture();
      utils.checkAxeAndClickContinueButton();

      utils.checkContentClaimantsInfoSSN();
      utils.fillInClaimantSSNFromFixture();
      utils.checkAxeAndClickContinueButton();

      // Claimant is a vet?
      cy.selectRadio('root_claimantIsVeteran', 'N');
      utils.checkAxeAndClickContinueButton();
      utils.checkAxeAndClickContinueButton();

      utils.checkContentClaimantsInfoAddress();
      utils.fillInSpouseMailingAddressFromFixture();
      utils.checkAxeAndClickContinueButton();

      utils.checkContentClaimantsEmailPhone();
      utils.fillInSpouseEmailAndPhoneFromFixture();

      // Claimant benifit type
      utils.checkContentClaimaintInfoBenefitType();
      const claimsBenefits = [
        'root_claims_dependencyIndemnityComp',
        'root_claims_survivorPension',
      ];
      utils.checkVaCheckbox('root_claims', claimsBenefits);
      utils.checkAxeAndClickContinueButton();

      // Va Benefits at death
      utils.checkContentVetsMilitaryHistory();
      cy.selectRadio('root_receivedBenefits', 'N');
      utils.checkAxeAndClickContinueButton();

      // Vet Military History Not yet implemented for this test.
      utils.fillInVetsMilitaryHistoryFromFixture();
      cy.injectAxeThenAxeCheck();

      // National Guard
      cy.selectRadio('root_nationalGuardActivated', 'N');
      utils.checkAxeAndClickContinueButton();

      // Service Name
      utils.checkContentServiceNames();
      utils.checkAxeAndClickContinueButton();

      // Any other Name question.
      cy.selectRadio('root_view:hasOtherServiceNames', 'N');
      utils.checkVisibleElementContent(
        'legend',
        'Did the Veteran serve under any other names? ',
      );
      utils.checkAxeAndClickContinueButton();

      // POW
      cy.selectRadio('root_prisonerOfWar', 'N');
      utils.checkAxeAndClickContinueButton();

      // Marriage to Veteran
      // Check the content within the fillIn function
      utils.fillInMarriageToVetNotMarriedFromFixture();

      // Legal Isues Marriage
      utils.checkContentMarriageLegalStatus();
      cy.selectRadio('root_awareOfLegalIssues', 'N');
      utils.checkAxeAndClickContinueButton();

      // Continuous Living with Vet
      utils.checkContentMarriageContinous();
      cy.selectRadio('root_livedContinuouslyWithVeteran', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Remarriage
      utils.checkContentMarriageRemarriage();
      cy.selectRadio('root_remarried', 'N');
      utils.checkAxeAndClickContinueButton();

      // Previous Marriage
      utils.checkContentPreviousMarriages();
      cy.selectRadio('root_recognizedAsSpouse', 'Y');
      cy.selectRadio('root_hadPreviousMarriages', 'N');
      utils.checkAxeAndClickContinueButton();

      // Vet Married to someone else.
      utils.checkAxeAndClickContinueButton();
      cy.selectRadio('root_view:wasMarriedBefore', 'N');
      utils.checkVisibleElementContent(
        'va-radio',
        'Was the Veteran married to someone else before being married to you?',
      );
      utils.checkAxeAndClickContinueButton();

      // Childred of Veteran
      utils.checkContentChildrenOfVet();
      cy.selectRadio('root_expectingChild', 'N');
      cy.selectRadio('root_hadChildWithVeteran', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Dependents into.
      utils.checkContentDependentsIntro();
      utils.checkAxeAndClickContinueButton();

      // Do you Dependents?
      utils.checkContentDependentsQuestion();
      cy.selectRadio('root_view:isAddingDependent', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Fill in Dependents Info
      utils.fillInDependentNameFromFixture();
      utils.checkContentDependentNamePage();
      
      cy.contains('STOP HERE');
      // DIC
      utils.checkContentDicBenefits();
      cy.selectRadio('root_dicType', 'DIC');
      utils.checkAxeAndClickContinueButton();

      // Treatment at VA Medical Centers Intro.
      utils.checkContentTreatmentVaMedicalCentersIntro();
      utils.checkAxeAndClickContinueButton();

      // Treatment at the VA Medical Center.
      utils.checkContentTreatmentVaMedicalCenters();
      cy.selectRadio('root_view:isAddingDicBenefits', 'N');
      utils.checkAxeAndClickContinueButton();

      // Nursing Home
      utils.checkContentNursingHome();
      cy.selectRadio('root_needRegularAssistance', 'N');
      cy.selectRadio('root_inNursingHome', 'N');
      utils.checkAxeAndClickContinueButton();

      // Assets over threshold
      utils.checkContentIncomeAssettsInto();
      cy.selectRadio('root_hasAssetsOverThreshold', 'N');
      utils.checkAxeAndClickContinueButton();

      // Total Assets
      utils.checkContentTotalAssets();
      cy.fillVaTextInput('root_totalAssets', '1000');
      utils.checkAxeAndClickContinueButton();

      // Transfer Assets
      utils.checkContentTransferedAssetts();
      cy.selectRadio('root_transferredAssets', 'N');
      utils.checkAxeAndClickContinueButton();

      // Home Ownership
      utils.checkContentHomeOwnership();
      cy.selectRadio('root_homeOwnership', 'N');
      utils.checkAxeAndClickContinueButton();

      // Income sources
      utils.checkContentIncomeSources();
      cy.selectRadio('root_moreThanFourSources', 'N');
      cy.selectRadio('root_otherIncomeLastYearNoLongerReceive', 'N');
      utils.checkAxeAndClickContinueButton();

      // Gross Monthly Income Intro
      utils.checkContentGrossMonthlyIncomeIntro();
      utils.checkAxeAndClickContinueButton();

      // Monthly Income Source
      utils.checkContentGrossMonthlyIncomeSource();
      cy.selectRadio('root_view:hasMonthlyIncomeSource', 'N');
      utils.checkAxeAndClickContinueButton();

      // Care Expenses
      utils.checkContentCareExpensesIntro();
      utils.checkAxeAndClickContinueButton();

      // Care Expenses
      utils.checkContentCareExpensesQuestion();
      cy.selectRadio('root_view:careExpensesList', 'N');
      utils.checkAxeAndClickContinueButton();

      // Medical and Other expesnes Intro
      utils.checkContentMedicalOtherExpensesIntro();
      utils.checkAxeAndClickContinueButton();

      // Medical Expenses Question
      utils.checkContentMedicalExpensesQuestion();
      cy.selectRadio('root_view:medicalExpensesList', 'N');
      utils.checkAxeAndClickContinueButton();

      // Direct Deposit
      utils.checkContentDirectDeposit();
      cy.selectRadio('root_hasBankAccount', 'N');
      utils.checkAxeAndClickContinueButton();

      // Other Payment Options
      utils.checkContentOtherPaymentOtionsIntro();
      utils.checkAxeAndClickContinueButton();

      // Supporting Documents
      utils.checkContentSupportingDocs();
      utils.checkAxeAndClickContinueButton();

      // Submit Supporting Docs
      // No supporting docks for now
      utils.CheckContentSubmitSupportingDocs();
      utils.checkAxeAndClickContinueButton();

      utils.fillInStatementOfTruthFromFixture();
      // Vet Military History Not yet implemented for this test.
      //   utils.fillInVetsMilitaryHistoryFromFixture();
      cy.injectAxeThenAxeCheck();
    });
  });
});
