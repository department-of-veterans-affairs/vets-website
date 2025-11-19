import * as utils from '../utils';

describe('Survivor Pension Benefits 534EZ ', () => {
  describe('Veteran reporting medical expenses', () => {
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

      utils.checkContentClaimantsInfoAddress();
      utils.fillInSpouseMailingAddressFromFixture();

      utils.checkContentClaimantsEmailPhone();
      utils.fillInSpouseEmailAndPhoneFromFixture();

      // Claimant benifit type
      utils.checkContentClaimaintInfoBenefitType();
      const claimsBenefits = ['root_claims_dependencyIndemnityComp'];
      utils.checkVaCheckbox('root_claims', claimsBenefits);
      utils.checkAxeAndClickContinueButton();

      // Va Benefits at death
      utils.checkContentVetsMilitaryHistory();
      cy.selectRadio('root_receivedBenefits', 'N');
      utils.checkAxeAndClickContinueButton();

      // Militarty History
      utils.checkContentVetsMilitaryHistoryData();
      utils.fillInVetsMilitaryHistoryFromFixture();

      // National Guard
      cy.selectRadio('root_nationalGuardActivated', 'Y');
      utils.checkAxeAndClickContinueButton();
      utils.fillInVetsNationalGuardServiceFromFixture();
      utils.checkAxeAndClickContinueButton();

      // National Guard Unit Address
      utils.fillInNationalGuardUntilAddressFromFixture();
      utils.checkContentNationalGuardAddress();
      utils.checkAxeAndClickContinueButton();

      // Service Name
      utils.checkContentServiceNames();
      utils.checkAxeAndClickContinueButton();

      // Any other Name question.
      cy.selectRadio('root_view:hasOtherServiceNames', 'Y');
      utils.checkVisibleElementContent(
        'legend',
        'Did the Veteran serve under any other names? ',
      );
      utils.checkAxeAndClickContinueButton();

      // Other name data entry.
      utils.checkContentOtherName();
      utils.fillInOtherNameFromFixture(' one');
      utils.checkAxeAndClickContinueButton();
      cy.selectRadio('root_view:hasOtherServiceNames', 'Y');
      utils.checkAxeAndClickContinueButton();
      utils.fillInOtherNameFromFixture(' two');
      utils.checkAxeAndClickContinueButton();

      // Edit and delete an Other Name
      cy.get('va-card[name="name_1"]')
        .shadow()
        .get('a[href="veteran/other-service-names/1?edit=true"]')
        .click();

      cy.fillVaTextInput('root_otherServiceName_first', 'New First Name');
      cy.get('va-button[text="Save and continue"]').click();
      // validate the change
      utils.checkVisibleElementContent(
        'va-alert',
        'You have added the maximum number of allowed service names for this application. You may edit or delete a name or choose to continue on in the application.',
      );
      utils.checkVisibleElementContent('va-card', 'New First Name');
      cy.get('va-card[name="name_1"]')
        .find('va-button-icon[button-type="delete"]')
        .click();
      cy.get('va-modal')
        .get('button')
        .contains('Yes')
        .click();
      utils.checkVisibleElementContent(
        'va-alert',
        'information has been deleted',
      );

      // Add yet another name.
      cy.selectRadio('root_view:hasOtherServiceNames', 'Y');
      utils.checkAxeAndClickContinueButton();
      utils.fillInOtherNameFromFixture(' three');
      utils.checkAxeAndClickContinueButton();
      utils.checkAxeAndClickContinueButton();

      // POW
      cy.selectRadio('root_prisonerOfWar', 'Y');
      utils.checkAxeAndClickContinueButton();
      utils.fillInPOWDatesFromFixture();
      utils.checkAxeAndClickContinueButton();

      // Marriage to Veteran
      // Check the content within the fillIn function
      utils.fillInMarriageToVetNotMarriedFromFixture();

      // Legal Isues Marriage
      utils.checkContentMarriageLegalStatus();
      cy.selectRadio('root_awareOfLegalIssues', 'Y');
      cy.fillVaTextInput('root_legalIssueExplanation', 'It just ended');
      utils.checkAxeAndClickContinueButton();

      // Continuous Living with Vet
      utils.checkContentMarriageContinous();
      cy.selectRadio('root_livedContinuouslyWithVeteran', 'N');
      utils.checkAxeAndClickContinueButton();
      cy.selectRadio('root_separationDueToAssignedReasons', 'OTHER');
      utils.checkAxeAndClickContinueButton();

      // Separation
      utils.fillInMarriageSeparationFromFixture();
      utils.checkContentMarriageSeparation();
      utils.checkAxeAndClickContinueButton();

      // Remarriage
      utils.checkContentMarriageRemarriage();
      cy.selectRadio('root_remarried', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Remarriage Details
      utils.checkContentRemarriageDetails();
      utils.fillInRemarriageDetailsFromFixture();
      utils.checkAxeAndClickContinueButton();
      cy.selectRadio('root_additionalMarriages', 'Y');
      utils.checkVisibleElementContent(
        'va-alert-expandable',
        "You'll need to submit VA Form 21-4138",
      );
      cy.selectRadio('root_additionalMarriages', 'N');
      utils.checkAxeAndClickContinueButton();

      // Previous Marriage
      utils.checkContentPreviousMarriages();
      cy.selectRadio('root_recognizedAsSpouse', 'N');
      cy.selectRadio('root_hadPreviousMarriages', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Previous Marriage continued.
      utils.checkContentVetsPreviousMarriages();
      utils.checkAxeAndClickContinueButton();

      // Vet Married to someone else.
      utils.checkContentVetMarriedToSomeoneElse();
      cy.selectRadio('root_view:hasPreviousMarriages', 'Y');
      utils.checkAxeAndClickContinueButton();

      // Previous Spouse
      utils.checkContentPreviousSpouse();
      utils.fillInPreviousSpouseNameFromFixture('');
      utils.checkAxeAndClickContinueButton();

      // Previous Marriage Details
      utils.fillInPreviousMarriageDetailsFromFixture();
      utils.checkContentPreviousMarriageDetailsPage();
      utils.checkAxeAndClickContinueButton();

      // Marriage Ended Reason
      utils.fillInHowMarriageEndedFromFixture();
      utils.checkContentHowMarriageEndedReasonPage();
      utils.checkAxeAndClickContinueButton();

      // Marriage Ended Details
      utils.fillInPreviousMarriageEndedDetailsFromFixture();
      utils.checkContentPreviousMarriageEndedDetails();
      utils.checkAxeAndClickContinueButton();

      cy.selectRadio('root_view:hasPreviousMarriages', 'N');
      utils.checkAxeAndClickContinueButton();

      // The Veteran's Previous Marriages.
      utils.checkContentVetsPreviousMarriageIntro();
      utils.checkAxeAndClickContinueButton();

      cy.selectRadio('root_view:wasMarriedBefore', 'Y');
      utils.checkVisibleElementContent(
        'va-radio',
        'Was the Veteran married to someone else before being married to you?',
      );
      utils.checkAxeAndClickContinueButton();
      cy.contains('STOP HERE');
      // Childred of Veteran
      utils.checkContentChildrenOfVet();
      cy.selectRadio('root_expectingChild', 'N');
      cy.selectRadio('root_hadChildWithVeteran', 'N');
      utils.checkAxeAndClickContinueButton();

      // Dependents into.
      utils.checkContentDependentsIntro();
      utils.checkAxeAndClickContinueButton();

      // Do you Dependents?
      utils.checkContentDependentsQuestion();
      cy.selectRadio('root_view:isAddingDependent', 'N');
      utils.checkAxeAndClickContinueButton();

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
