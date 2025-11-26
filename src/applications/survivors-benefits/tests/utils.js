import fixtureData from './fixtures/data/fixtureData.json';

/**
 * Check a11y on the page and click the continue button.
 */
export const checkAxeAndClickContinueButton = () => {
  cy.injectAxeThenAxeCheck();
  cy.clickFormContinue();
};

/**
 * Check an html element for visibility and content
 */
export const checkVisibleElementContent = (element, content) => {
  cy.get(element)
    .should('exist')
    .and('be.visible')
    .contains(content);
};

/**
 * Check the content on the intro page for anonymous users.
 */
export const checkContentAnonymousIntroPageContent = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('h2', 'Follow these steps to get started:');
  checkVisibleElementContent('va-process-list', 'Check your eligibility');
  checkVisibleElementContent(
    'va-process-list',
    'Check your eligibility requirements before you apply. If you think you may be eligible, but you’re not sure, we encourage you to apply.',
  );
  checkVisibleElementContent(
    'va-process-list',
    'You can also upload evidence (supporting documents) to support your application.',
  );
};

/**
 * Check content on Vet's Name and DOB page
 */
export const checkContentNameDobPage = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Veteran’s name and date of birth');
  checkVisibleElementContent('va-text-input', 'First name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last name');
  checkVisibleElementContent('va-select', 'Suffix');
  checkVisibleElementContent('va-memorable-date', 'Date of birth');
};

/**
 * Check the content on the Vet's Info SSN page
 */
export const checkContentVetInfoSSN = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Veteran’s identification information');
  checkVisibleElementContent('va-text-input', 'Social Security number');
  checkVisibleElementContent('va-text-input', 'VA file number');
};

/**
 * Check content for Additional Vet's Infor page
 */
export const checkContentAdditionalVetsInfo = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Additional Veteran information');
  checkVisibleElementContent(
    'va-radio',
    'Has the Veteran, surviving spouse, child or parent ever filed a claim with the VA?',
  );
  checkVisibleElementContent(
    'va-radio',
    'Did the Veteran die while on active duty?',
  );
  checkVisibleElementContent('va-memorable-date', 'Date of death');
};

/**
 * Check the content on the Claimants Relationship page
 */
export const checkContentClaimantsRelationship = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'legend',
    'Claimant’s relationship to the Veteran',
  );
};

/**
 * Check content on the Claimant address page.
 */
export const checkContentClaimantsAddress = () => {
  checkVisibleElementContent('va-text-input', 'First name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last name');
  checkVisibleElementContent('va-select', 'Suffix');
  checkVisibleElementContent('va-memorable-date', 'Date of birth');
};

/**
 * Check the Claimant SSN page content
 */
export const checkContentClaimantsInfoSSN = () => {
  checkVisibleElementContent('va-text-input', 'Social Security number');
};

/**
 * Check the content for the Claimant's Address information page
 */
export const checkContentClaimantsInfoAddress = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Mailing address');
  checkVisibleElementContent('va-select', 'Country');
  checkVisibleElementContent('va-text-input', 'Street address');
  checkVisibleElementContent('va-text-input', 'Street address line 2');
  checkVisibleElementContent('va-text-input', 'City');
  checkVisibleElementContent('va-text-input', 'State, province, or region');
  checkVisibleElementContent('va-text-input', 'Postal code');
};

/**
 * Check content for Claimant's Email and Phone page
 */
export const checkContentClaimantsEmailPhone = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Email address and phone number');
  checkVisibleElementContent('va-text-input', 'Email');
  checkVisibleElementContent('va-telephone-input', 'Primary phone number');
};

/**
 * Check the content on the Claimant's Info Benefit Type page
 */
export const checkContentClaimaintInfoBenefitType = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Benefit type');
  checkVisibleElementContent(
    'va-checkbox-group',
    'Select the benefits you want to file a claim for. ',
  );
  checkVisibleElementContent(
    'va-checkbox-group',
    'Dependency and indemnity compensation (DIC)',
  );
  checkVisibleElementContent('va-checkbox-group', 'Survivors Pension');
  checkVisibleElementContent('va-checkbox-group', 'Accrued benefits');
};

/**
 * Check the content on the Veteran's Military History initial page
 */
export const checkContentVetsMilitaryHistory = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'VA benefits');
  checkVisibleElementContent(
    'va-radio',
    'Was the Veteran receiving VA compensation or pension benefits at the time of their death? ',
  );
};

/**
 * Check the content on the Veteran's Military History data page
 */
export const checkContentVetsMilitaryHistoryData = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Service period');
  checkVisibleElementContent('va-checkbox-group', 'Branch of service ');
  checkVisibleElementContent('va-checkbox', 'Army');
  checkVisibleElementContent('va-checkbox', 'Navy');
  checkVisibleElementContent('va-checkbox', 'Air Force');
  checkVisibleElementContent('va-checkbox', 'Coast Guard');
  checkVisibleElementContent('va-checkbox', 'Marine Corps');
  checkVisibleElementContent('va-checkbox', 'Space Force');
  checkVisibleElementContent('va-checkbox', 'USPHS');
  checkVisibleElementContent('va-checkbox', 'NOAA');
  checkVisibleElementContent(
    'va-memorable-date',
    'Date initially entered active duty',
  );
  checkVisibleElementContent(
    'va-memorable-date',
    'Final release date from active duty',
  );
  checkVisibleElementContent(
    'va-text-input',
    'Place of Veteran’s last separation',
  );
};
/**
 * Check content for the Marriage to a Veteran page.
 */
export const checkContentMarriageToVet = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Marriage to Veteran');
  checkVisibleElementContent(
    'va-radio',
    'Were you married to the Veteran at the time of their death? ',
  );
  checkVisibleElementContent('va-memorable-date', 'Date of marriage');
  checkVisibleElementContent('va-text-input', 'Place of marriage');
  checkVisibleElementContent('va-text-input', 'Place marriage ended');
  checkVisibleElementContent('va-radio', 'How did you get married?');
  checkVisibleElementContent('va-text-input', 'Tell us how you got married');
};

/**
 * Check the content for the Legal Status Marriage page.
 */
export const checkContentMarriageLegalStatus = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Legal status of marriage');
  checkVisibleElementContent(
    'va-radio',
    'At the time of your marriage to the Veteran, were you aware of any reason the marriage might not be legally valid? ',
  );
};

/**
 * Check the status of the Marriage Status Continuous page.
 */
export const checkContentMarriageContinous = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Marriage status');
  checkVisibleElementContent(
    'va-radio',
    'Did you live continuously with the Veteran from the date of marriage to the date of their death? ',
  );
};

/**
 * Check the content on the page for Previous Marriages
 */
export const checkContentPreviousMarriages = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Previous marriages');
  checkVisibleElementContent(
    'va-radio',
    'Did we recognize you as the Veteran’s spouse before their death?',
  );
  checkVisibleElementContent(
    'va-radio',
    'Were you or the Veteran married to anyone else before you married each other?',
  );
};

/**
 * Check the content on the Household Information Vet's Previous Marriages.
 */
export const checkContentVetsPreviousMarriages = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Your previous marriages');
  checkVisibleElementContent(
    'form',
    "Next we'll ask you about your previous marriages before your marriage to the Veteran. You may add up to 2 marriages.",
  );
};

/**
 * Check the status of the Marriage Status Remarriage page.
 */
export const checkContentMarriageRemarriage = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Remarriage');
  checkVisibleElementContent(
    'va-radio',
    'Have you remarried since the death of the Veteran?',
  );
};

/**
 * Check Content for Vet Married to someone else page.
 */
export const checkContentVetMarriedToSomeoneElse = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you have a marriage to add that was before your marriage to the Veteran?',
  );
};

/**
 * Check the content for Children of Vet (none) page.
 */
export const checkContentChildrenOfVet = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Children of Veteran');
  checkVisibleElementContent(
    'va-radio',
    "Are you expecting the birth of the Veteran's child?",
  );
  checkVisibleElementContent(
    'va-radio',
    'Did you have a child with the Veteran before or during your marriage? ',
  );
};

/**
 * Check the content on the DIC Benefits page.
 */
export const checkContentDicBenefits = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'DIC benefits');
  checkVisibleElementContent(
    'va-radio',
    'What Dependency and indemnity compensation (DIC) benefit are you claiming?',
  );
};

/**
 * Check content on Dependents intro page.
 */
export const checkContentDependentsIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'form',
    'Next we’ll ask you about your dependent children. You may add up to 3 dependents.',
  );
  checkVisibleElementContent(
    'va-additional-info',
    'Who we consider a dependent child',
  );
};

/**
 * Check content for the Dependents question page.
 */
export const checkContentDependentsQuestion = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you have a dependent child to add?',
  );
};

/**
 * Check content on the Treatement at VA Medical Centers Intro page.
 */
export const checkContentTreatmentVaMedicalCentersIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Treatment at VA medical centers');
  checkVisibleElementContent(
    'form',
    'Next we’ll ask you about VA medical centers where the Veteran received treatment pertaining to your claim. You may add up to 3 VA medical centers.',
  );
};

/**
 * Check content on the Treatement at VA Medical Centers page.
 */
export const checkContentTreatmentVaMedicalCenters = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'va-radio',
    'Did the Veteran receive treatment at a VA medical center?',
  );
};

/**
 * Check content for Nursing Home page.
 */
export const checkContentNursingHome = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'legend',
    'Nursing home or increased survivor entitlement',
  );
  checkVisibleElementContent(
    'va-radio',
    'Are you claiming special monthly pension or special monthly DIC because you need the regular assistance of another person, have severe visual problems, or are generally confined to your immediate premises?',
  );
  checkVisibleElementContent('va-radio', 'Are you in a nursing home?');
};

/**
 * Check the content for the Financial Information Income and Assetts page
 * (under threshold)
 */
export const checkContentIncomeAssettsInto = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Income and assets');
  checkVisibleElementContent('va-accordion-item', 'What we consider an asset');
  checkVisibleElementContent(
    'va-accordion-item',
    'Who we consider a dependent',
  );
  checkVisibleElementContent(
    'va-accordion-item',
    'Whose assets you need to report',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you and your dependents have over $75,000 in assets?',
  );
};

export const checkContentTotalAssets = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Total assets');
  checkVisibleElementContent(
    'va-text-input',
    'Estimate the total value of your assets',
  );
};

/**
 * Check the content for the Transferred Assets page
 */
export const checkContentTransferedAssetts = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Transferred assets');
  checkVisibleElementContent(
    'va-radio',
    'Did you or your dependents transfer any assets in the last 3 calendar years? ',
  );
  checkVisibleElementContent(
    'va-additional-info',
    'How to tell if you have transferred assets',
  );
};

/**
 * Check the content for the Home Ownership page
 */
export const checkContentHomeOwnership = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Homeownership');
  checkVisibleElementContent(
    'va-radio',
    'Do you or your dependents own your home (also known as your primary residence)?',
  );
};

/**
 * Check content on the Income Sources page.
 */
export const checkContentIncomeSources = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Income sources');
  checkVisibleElementContent(
    'va-radio',
    'Do you or your dependents have more than 4 sources of income?',
  );
  checkVisibleElementContent(
    'va-radio',
    'Other than Social Security, did you or your dependents receive any income last year that you no longer receive?',
  );
};

/**
 * Check the content on the Gross Monthly Income intro page.
 */
export const checkContentGrossMonthlyIncomeIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Gross monthly income');
  checkVisibleElementContent(
    'fieldset',
    'Next we’ll ask you the gross monthly income you, your spouse, and your dependents receive. You’ll need to add at least 1 income source and can add up to 4.',
  );
  checkVisibleElementContent(
    'fieldset',
    "If you’ve been told to complete an Income and Asset Statement in Support of Claim for Pension or Parents' Dependency and Indemnity Compensation (VA Form 21P-0969), we only require that Social Security income be reported in this step. All other income should be reported on the VA Form 21P-0969.",
  );
};

/**
 * Check content on the Montly Income page.
 */
export const checkContentGrossMonthlyIncomeSource = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you have a monthly income source to add?',
  );
};

/**
 * Check the content for the Care Expenses Intro page.
 */
export const checkContentCareExpensesIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Care expenses');
  checkVisibleElementContent(
    'fieldset',
    'Next we’ll ask you about unreimbursed recurring care expenses that you or your dependents pay for. You may add up to 3 care expenses.',
  );
  checkVisibleElementContent(
    'fieldset',
    'Examples of unreimbursed care expenses include payments to in-home care providers, nursing homes, or other care facilities that insurance won’t cover.',
  );
  checkVisibleElementContent(
    'va-additional-info',
    'Additional documents we may ask for',
  );
};

/**
 * Check the contents for the Care Expenses question page
 */
export const checkContentCareExpensesQuestion = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('va-radio', 'Do you have a care expense to add?');
};

/**
 * Check the content on Medical Expenses and Other intro page.
 */
export const checkContentMedicalOtherExpensesIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Medical and other expenses');
  checkVisibleElementContent(
    'fieldset',
    'We’ll now ask about medical or certain other expenses that aren’t reimbursed.',
  );
  checkVisibleElementContent(
    'va-additional-info',
    'How to report monthly recurring expenses',
  );
};

/**
 * Check the content for Medical Expenses Quesiton page.
 */
export const checkContentMedicalExpensesQuestion = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you have a medical or other expense to add?',
  );
};

/**
 * Check the content for the Direct Deposit page.
 */
export const checkContentDirectDeposit = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Direct deposit for survivor benefits');
  checkVisibleElementContent(
    'fieldset',
    'The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit. If we approve your application, we’ll use direct deposit to deposit your payments directly into a bank account.',
  );
  checkVisibleElementContent(
    'va-radio',
    'Do you have a bank account to use for direct deposit? ',
  );
};

/**
 * Check content on the Other Payment Options intro page
 */
export const checkContentOtherPaymentOtionsIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Other payment options');
  checkVisibleElementContent(
    'h4',
    'Option 1: Get your payment through Direct Express Debit MasterCard',
  );
  checkVisibleElementContent('h4', 'Option 2: Open a bank account');
  checkVisibleElementContent('va-link', 'Go to the VBBP website');
};

/**
 * Check the content on the Supporting Docs page
 */
export const checkContentSupportingDocs = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Supporting documents');
  checkVisibleElementContent(
    'fieldset',
    'Next we’ll ask you to submit evidence (supporting documents) for your claim. If you upload all of this information online now, you may be able to get a faster decision on your claim.',
  );
  checkVisibleElementContent('h4', 'Required documents');
  checkVisibleElementContent(
    'va-accordion-item',
    'Veteran’s death certificate',
  );
  checkVisibleElementContent(
    'va-accordion-item',
    'Veteran’s DD214 or separation documents',
  );
  checkVisibleElementContent('h4', 'Other documents you may need');
  checkVisibleElementContent('va-accordion-item', 'Income and net worth');
  checkVisibleElementContent(
    'va-accordion-item',
    'Special circumstances regarding your medical care',
  );
  checkVisibleElementContent('va-accordion-item', 'Dependent children');
  checkVisibleElementContent('va-accordion-item', 'Marriage history');
};

/**
 * Check the content on the Separation page.
 */
export const checkContentMarriageSeparation = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Separation details');
  checkVisibleElementContent(
    'va-text-input',
    'Tell us the reason for the separation',
  );
  checkVisibleElementContent('va-memorable-date', 'Start date of separation');
  checkVisibleElementContent('va-memorable-date', 'End date of separation');
  checkVisibleElementContent(
    'va-radio',
    'Was the separation due to a court order?',
  );
  // We need to check for the alert now because we chose Yes for separation.
  checkVisibleElementContent(
    'va-alert-expandable',
    "You'll need to submit a copy of the court order.",
  );
};
/**
 * Check the content on the Submit Supporting Docs page.
 */
export const CheckContentSubmitSupportingDocs = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Submit your supporting documents');
  checkVisibleElementContent(
    'va-file-input-multiple',
    'Select a file to upload',
  );
};
/**
 * Start the application process while not logged in
 */
export const startApplicationWithoutLogin = () => {
  cy.visit(
    '/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez',
  );

  cy.injectAxeThenAxeCheck();
  checkContentAnonymousIntroPageContent();

  cy.get('va-alert-sign-in')
    .get('a[class="schemaform-start-button"]')
    .click();
};

/**
 * Check content for the National Guard Address page.
 */
export const checkContentNationalGuardAddress = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'National Guard Unit address');
  checkVisibleElementContent('va-select', 'Country');
  checkVisibleElementContent('va-text-input', 'Street address');
  checkVisibleElementContent('va-text-input', 'Street address line 2');
  checkVisibleElementContent('va-text-input', 'City');
  checkVisibleElementContent('va-select', 'State');
  checkVisibleElementContent('va-text-input', 'Postal code');
};

/**
 * Check the content for the Sercie Names page.
 */
export const checkContentServiceNames = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Service names');
  checkVisibleElementContent(
    'fieldset',
    'Next we’ll ask you about other names the Veteran served under. You may add up to 2 names.',
  );
};

/**
 * Check the content on the Other Name data page.
 */
export const checkContentOtherName = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Other service name');
  checkVisibleElementContent('va-text-input', 'First name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last name');
  checkVisibleElementContent('va-select', 'Suffix');
  // Check that there's a button to cancel.
  checkVisibleElementContent('va-button', 'Cancel adding this name');
};

/**
 * Check content for the Previous Spouse page
 */
export const checkContentPreviousSpouse = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Previous spouse’s name');
  checkVisibleElementContent('va-text-input', 'First name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last name');
  checkVisibleElementContent('va-select', 'Suffix');
  // Check that there's a button to cancel.
  // checkVisibleElementContent(
  //   'va-button',
  //   'Cancel adding this previous marriage',
  // );
};

/**
 * Check the content on the Previous Marriage Details page.
 */
export const checkContentPreviousMarriageDetailsPage = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'When and where did you get married?');
  checkVisibleElementContent('va-memorable-date', 'Date of marriage');
  checkVisibleElementContent('va-checkbox', 'I got married outside the U.S.');
  checkVisibleElementContent('va-text-input', 'City');
  checkVisibleElementContent('va-select', 'State');
};

/**
 * Check the content for the Remarriage Details page.
 */
export const checkContentRemarriageDetails = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Remarriage details');
  checkVisibleElementContent('va-memorable-date', 'Date of marriage');
  checkVisibleElementContent('va-memorable-date', 'Date marriage ended');
  checkVisibleElementContent(
    'va-memorable-date',
    'Leave blank if you are still married',
  );
};

/**
 * Check the content for the How did the Marriage End Reason page.
 */
export const checkContentHowMarriageEndedReasonPage = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('va-radio', 'How did the marriage end?');
  checkVisibleElementContent('va-text-input', 'Tell us how the marriage ended');
};

/**
 * Check the content for the Remarriage Details page.
 */
export const checkContentPreviousMarriageEndedDetails = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'When and where did your marriage end?');
  checkVisibleElementContent('va-memorable-date', 'Date marriage ended');
  checkVisibleElementContent(
    'va-checkbox',
    'My marriage ended outside the U.S.',
  );
  checkVisibleElementContent('va-text-input', 'City');
  checkVisibleElementContent('va-select', 'State');
  // checkVisibleElementContent(
  //   'va-button',
  //   'Cancel adding this previous marriage',
  // );
  // checkAxeAndClickContinueButton();
  // Check that the previous marriage is listed here:
  // checkVisibleElementContent(
  //   'va-card',
  //   fixtureData.data.attributes.spouseData.previousSpouseFirstName,
  // );
  // checkVisibleElementContent(
  //   'va-card',
  //   fixtureData.data.attributes.spouseData.previousSpouseLastName,
  // );
};

/**
 * Check the content for the Vet's Previous Marriage into page.
 */
export const checkContentVetsPreviousMarriageIntro = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Veteran’s previous marriages');
  checkVisibleElementContent(
    'fieldset',
    'Next we’ll ask you about the Veteran’s previous marriages. You may add up to 2 marriages.',
  );
};

/**
 * Check content on the Dependent Name page 
 */
/**
 * Check content on Vet's Name and DOB page
 */
export const checkContentDependentNamePage = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', "Dependent's name and information");
  checkVisibleElementContent('va-text-input', 'First name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last name');
  checkVisibleElementContent('va-select', 'Suffix');
  checkVisibleElementContent('va-text-input', 'Social Security number');
  checkVisibleElementContent(
    'va-checkbox',
    "Doesn't have a Social Security number",
  );
};

/**
 * Fill in the name fields from the fixture data.
 */
export const fillInNameFromFixture = () => {
  // We seem to get stuck on this first field entry, to set a custom timeout for it.
  cy.get('va-text-input[name="root_veteranFullName_first"]', { timeout: 20000 })
    .shadow()
    .get('input[name="root_veteranFullName_first"]:not([disabled]')
    .then(() => {
      cy.get('input[name="root_veteranFullName_first"]').type(
        fixtureData.data.attributes.profile.first_name,
      );
      cy.get('input[name="root_veteranFullName_middle"]').type(
        fixtureData.data.attributes.profile.middle_name,
      );
      cy.get('input[name="root_veteranFullName_last"]').type(
        fixtureData.data.attributes.profile.last_name,
      );
      cy.fillDate(
        'root_veteranDateOfBirth',
        fixtureData.data.attributes.profile.birth_date,
      );
      checkAxeAndClickContinueButton();
    });
  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the Vet's SSN, VA File Number and Service Number.
 */
export const fillInSsnFromFixture = () => {
  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_ssn',
    fixtureData.data.attributes.profile.ssn,
  );

  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_vaFileNumber',
    fixtureData.data.attributes.profile.vaFileNumber,
  );

  checkAxeAndClickContinueButton();
};

/**
 * Fill out the Vet's information about dependents and active duty
 */
export const fillInVetInformationFromFixture = () => {
  cy.selectRadio('root_vaClaimsHistory', 'Y');
  cy.selectRadio('root_diedOnDuty', 'Y');
  cy.fillDate(
    'root_veteranDateOfDeath',
    fixtureData.data.attributes.profile.dateOfDeath,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the spouse data
 */
export const fillInClaimantsRelationshipDataFromFixture = () => {
  cy.selectRadio('root_claimantRelationship', 'SPOUSE');
};

/**
 * Fill in the spouse/laimantrelationship data
 */
export const fillInClaimantsAddressFromFixture = () => {
  cy.get('input[name="root_claimantFullName_first"]').type(
    fixtureData.data.attributes.spouseData.first_name,
  );
  cy.get('input[name="root_claimantFullName_middle"]').type(
    fixtureData.data.attributes.spouseData.middle_name,
  );
  cy.get('input[name="root_claimantFullName_last"]').type(
    fixtureData.data.attributes.spouseData.last_name,
  );

  cy.fillDate(
    'root_claimantDateOfBirth',
    fixtureData.data.attributes.spouseData.birth_date,
  );
};

/**
 * Fill in the spouse/laimantrelationship data
 */
export const fillInClaimantSSNFromFixture = () => {
  cy.fillVaTextInput(
    'root_claimantSocialSecurityNumber',
    fixtureData.data.attributes.spouseData.ssn,
  );
};

/**
 * Fill in Spouse/Claimant mailing data.
 */
export const fillInSpouseMailingAddressFromFixture = () => {
  cy.get('select[name="root_claimantAddress_country"]').select(
    fixtureData.data.attributes.spouseData.country,
  );

  cy.get('input[name="root_claimantAddress_street"').type(
    fixtureData.data.attributes.spouseData.street,
  );
  cy.get('input[name="root_claimantAddress_street2"]').type(
    fixtureData.data.attributes.spouseData.street2,
  );

  cy.get('.vads-web-component-pattern-address').fillVaTextInput(
    'root_claimantAddress_city',
    fixtureData.data.attributes.spouseData.city,
  );

  cy.get('va-select')
    .shadow()
    .get('select[name="root_claimantAddress_state"]')
    .select(fixtureData.data.attributes.spouseData.state);
  cy.get('input[name="root_claimantAddress_postalCode"]').type(
    fixtureData.data.attributes.spouseData.zip,
  );

  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the phone data from the fixture.
 */
export const fillInSpouseEmailAndPhoneFromFixture = () => {
  cy.get('input[name="root_email"').type(
    fixtureData.data.attributes.spouseData.email,
  );

  cy.get('va-telephone-input[name="root_primaryPhone"]')
    .shadow()
    .get('va-text-input')
    .shadow()
    .get('.va-input-telephone-wrapper')
    .get('input[type="tel"]')
    .type(fixtureData.data.attributes.spouseData.phone);

  checkAxeAndClickContinueButton();
};

/**
 * Check a VAcheckbox.  This may want to be a cypress command.
 * @param {*} checkboxName - The html Name for the checkbox.
 * @param {*} value - The array of elements to check.
 */
export const checkVaCheckbox = (checkboxName, value) => {
  if (typeof value !== 'undefined') {
    value.forEach(claimName => {
      cy.get(`va-checkbox-group[name="${checkboxName}"]`)
        .get(`input[type="checkbox"][name="${claimName}"]`)
        .check();
    });
  }
};

/**
 * Fill in the Veteran's Military History
 */
export const fillInVetsMilitaryHistoryFromFixture = () => {
  checkVaCheckbox('root_branchOfService', [
    `root_branchOfService_${fixtureData.data.attributes.profile.serviceBranch}`,
  ]);
  cy.fillDate(
    'root_dateInitiallyEnteredActiveDuty',
    fixtureData.data.attributes.profile.activeDutyFrom,
  );
  cy.fillDate(
    'root_finalReleaseDateFromActiveDuty',
    fixtureData.data.attributes.profile.activeDutyTo,
  );
  cy.fillVaTextInput(
    'root_cityStateOrForeignCountry',
    fixtureData.data.attributes.profile.activeDutySeparation,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Marriage to Vet info from the Fixture
 */
export const fillInMarriageToVetFromFixture = () => {
  cy.selectRadio('root_marriedAtDeath', 'Y');
  cy.fillDate(
    'root_marriageDate',
    fixtureData.data.attributes.spouseData.marriageStartDate,
  );
  cy.fillDate(
    'root_marriageEndDate',
    fixtureData.data.attributes.spouseData.marriageEndDate,
  );
  cy.fillVaTextInput(
    'root_placeOfMarriage',
    fixtureData.data.attributes.spouseData.marriagePlace,
  );
  cy.fillVaTextInput(
    'root_placeMarriageEnded',
    fixtureData.data.attributes.spouseData.marriageEndPlace,
  );
  cy.selectRadio(
    'root_marriageType',
    fixtureData.data.attributes.spouseData.marriageType,
  );
  cy.fillVaTextInput(
    'root_marriageTypeOther',
    fixtureData.data.attributes.spouseData.marriageTypeOther,
  );
  // Check the content here because this page changes due to answers.
  checkContentMarriageToVet();
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Marriage to Vet info from the Fixture
 */
export const fillInMarriageToVetNotMarriedFromFixture = () => {
  cy.fillDate(
    'root_marriageToVeteranStartDate',
    fixtureData.data.attributes.spouseData.marriageStartDate,
  );
  cy.fillVaTextInput(
    'root_marriageToVeteranStartLocation_city',
    fixtureData.data.attributes.spouseData.marriagePlace,
  );
  cy.get('va-select')
    .shadow()
    .get('select[name="root_marriageToVeteranStartLocation_state"]')
    .select(fixtureData.data.attributes.spouseData.state);

  // Check the content here because this page changes due to answers.
  checkAxeAndClickContinueButton();

  cy.selectRadio(
    'root_marriageType',
    fixtureData.data.attributes.spouseData.marriageType,
  );
  cy.fillVaTextInput(
    'root_marriageTypeOther',
    fixtureData.data.attributes.spouseData.marriageTypeOther,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Statement of Truth from the Fixture data.
 */
export const fillInStatementOfTruthFromFixture = () => {
  cy.get('va-statement-of-truth')
    .shadow()
    .get('va-checkbox')
    .shadow()
    .get('input[type="checkbox"]')
    .check();

  const fullName = `${fixtureData.data.attributes.profile.first_name} ${
    fixtureData.data.attributes.profile.middle_name
  } ${fixtureData.data.attributes.profile.last_name}`;
  cy.get('va-statement-of-truth')
    .shadow()
    .get('#veteran-signature')
    .shadow()
    .get('input[name="veteran-signature"')
    .type(fullName);

  cy.injectAxeThenAxeCheck();
  // cy.get('button[class="usa-button-primary"]').click();
};

/**
 * Fill in the Vet's National Guard data from the fixture
 */
export const fillInVetsNationalGuardServiceFromFixture = () => {
  cy.fillDate(
    'root_dateOfActivation',
    fixtureData.data.attributes.profile.nationalGuardActivation,
  );
  cy.fillVaTextInput(
    'root_unitName',
    fixtureData.data.attributes.profile.nationalGuardUnit,
  );
  cy.get('va-telephone-input[name="root_unitPhoneNumber"]')
    .shadow()
    .get('va-text-input')
    .shadow()
    .get('.va-input-telephone-wrapper')
    .get('input[type="tel"]')
    .type(fixtureData.data.attributes.profile.nationalGuardPhone);
};

/**
 * Fill in the National Guard Unit Address data from the Fixture
 */
export const fillInNationalGuardUntilAddressFromFixture = () => {
  cy.get('select[name="root_unitAddress_country"]').select(
    fixtureData.data.attributes.profile.nationalGuardCountry,
  );

  cy.get('input[name="root_unitAddress_street"').type(
    fixtureData.data.attributes.profile.nationalGuardStreet,
  );
  cy.get('input[name="root_unitAddress_street2"]').type(
    fixtureData.data.attributes.profile.nationalGuardStreet2,
  );

  cy.get('.vads-web-component-pattern-address').fillVaTextInput(
    'root_unitAddress_city',
    fixtureData.data.attributes.profile.nationalGuardCity,
  );

  cy.get('va-select')
    .shadow()
    .get('select[name="root_unitAddress_state"]')
    .select(fixtureData.data.attributes.profile.nationalGuardState);
  cy.get('input[name="root_unitAddress_postalCode"]').type(
    fixtureData.data.attributes.profile.nationalGuardZip,
  );
};

/**
 * Fill in the data for Other Name page.
 */
export const fillInOtherNameFromFixture = extraText => {
  const firstName =
    fixtureData.data.attributes.profile.otherNameFirstName + extraText;
  const middleName =
    fixtureData.data.attributes.profile.otherNameMiddleName + extraText;
  const lastName =
    fixtureData.data.attributes.profile.otherNameLastName + extraText;
  // This one keeps tripping up, so check that the field is there.
  checkVisibleElementContent('va-text-input', 'First name');
  cy.fillVaTextInput('root_otherServiceName_first', firstName);
  cy.fillVaTextInput('root_otherServiceName_middle', middleName);
  cy.fillVaTextInput('root_otherServiceName_last', lastName);
};

/**
 * Fill in the POW dates from the fixture data.
 */
export const fillInPOWDatesFromFixture = () => {
  cy.fillDate(
    'root_powPeriod_from',
    fixtureData.data.attributes.profile.POWStart,
  );
  cy.fillDate('root_powPeriod_to', fixtureData.data.attributes.profile.POWEnd);
};

/**
 * Fill in the data for the Marriage Separation page from the fixture
 */
export const fillInMarriageSeparationFromFixture = () => {
  cy.fillVaTextInput(
    'root_separationExplanation',
    fixtureData.data.attributes.spouseData.marriageSeparationReason,
  );
  cy.fillDate(
    'root_separationStartDate',
    fixtureData.data.attributes.spouseData.marriageSeparationStart,
  );
  cy.fillDate(
    'root_separationEndDate',
    fixtureData.data.attributes.spouseData.marriageSeparationEnd,
  );
  cy.selectRadio(
    'root_courtOrderedSeparation',
    fixtureData.data.attributes.spouseData.marriageSeparationCourtOrder,
  );
};

/**
 * Fill in data for Remarriage Details from fixture
 */
export const fillInRemarriageDetailsFromFixture = () => {
  cy.selectRadio(
    'root_remarriageEndReason',
    fixtureData.data.attributes.spouseData.remarriageEndReason,
  );
  cy.fillDate(
    'root_remarriageDate',
    fixtureData.data.attributes.spouseData.remarriageDateStart,
  );
};

/**
 * Fill in the Previous Spouse name from fixture.
 */

export const fillInPreviousSpouseNameFromFixture = extraText => {
  const firstName =
    fixtureData.data.attributes.spouseData.previousSpouseFirstName + extraText;
  const middleName =
    fixtureData.data.attributes.spouseData.previousSpouseMiddleName + extraText;
  const lastName =
    fixtureData.data.attributes.spouseData.previousSpouseLastName + extraText;

  cy.fillVaTextInput('root_previousSpouseName_first', firstName);
  cy.fillVaTextInput('root_previousSpouseName_middle', middleName);
  cy.fillVaTextInput('root_previousSpouseName_last', lastName);
};

/**
 * Fill in Previous Marriage details from fixture
 */
export const fillInPreviousMarriageDetailsFromFixture = () => {
  const checkboxName = 'root_marriedOutsideUS';
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .check();
  // Check that the state field changed to country
  checkVisibleElementContent('va-select', 'Country');
  // Uncheck the outside of the US and check that state field is visible.
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .uncheck();
  checkVisibleElementContent('va-select', 'State');
  cy.fillDate(
    'root_marriageToVeteranDate',
    fixtureData.data.attributes.spouseData.previousMarriageDate,
  );
  cy.get('va-select')
    .shadow()
    .get('select[name="root_marriageLocation_state"]')
    .select(fixtureData.data.attributes.spouseData.previousMarriageState);
  cy.fillVaTextInput(
    'root_marriageLocation_city',
    fixtureData.data.attributes.spouseData.previousMarriageCity,
  );
};

/**
 * Fill in the How did the Marriage End page from the fixture
 */
export const fillInHowMarriageEndedFromFixture = () => {
  cy.selectRadio(
    'root_marriageEndReason',
    fixtureData.data.attributes.spouseData.previousMarriageEndReason,
  );
  cy.get('va-text-input[name="root_marriageEndOtherReason"]')
    .shadow()
    .get('input[name="root_marriageEndOtherReason"]')
    .type(
      'fixtureData.data.attributes.spouseData.previousMarriageEndReasonDetails',
    );
};

/**
 * Fill in Previous Marriage ENDED details from fixture
 */
export const fillInPreviousMarriageEndedDetailsFromFixture = () => {
  const checkboxName = 'root_marriageToVeteranEndOutsideUS';
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .check();
  // Check that the state field changed to country
  checkVisibleElementContent('va-select', 'Country');
  // Uncheck the outside of the US and check that state field is visible.
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .uncheck();
  checkVisibleElementContent('va-select', 'State');
  cy.fillDate(
    'root_marriageToVeteranEndDate',
    fixtureData.data.attributes.spouseData.previousMarriageEndDate,
  );
  cy.get('va-select')
    .shadow()
    .get('select[name="root_marriageToVeteranEndLocation_state"]')
    .select(fixtureData.data.attributes.spouseData.previousMarriageEndState);
  cy.fillVaTextInput(
    'root_marriageToVeteranEndLocation_city',
    fixtureData.data.attributes.spouseData.previousMarriageEndCity,
  );
};

/**
 * Fill in the dependent Name from Fixture
 */
export const fillInDependentNameFromFixture = () => {
  const firstName = fixtureData.data.attributes.dependentData.first_name;
  const middleName = fixtureData.data.attributes.dependentData.last_name;
  const lastName = fixtureData.data.attributes.dependentData.middle_name;
  const ssn = fixtureData.data.attributes.dependentData.ssn;

  // This one keeps tripping up, so check that the field is there.
  checkVisibleElementContent('va-text-input', 'First name');
  cy.fillVaTextInput('root_dependentFullName_first', firstName);
  cy.fillVaTextInput('root_dependentFullName_last', middleName);
  cy.fillVaTextInput('root_dependentFullName_middle', lastName);

  // Click the does not have SSN and check that the SSN field disappears.
  const checkboxName = 'root_noSsn';
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .check();
  // check that the SSN text box is not there.
  cy.get('va-text-input[name="root_dependentSocialSecurityNumber"]').should(
    'not.exist',
  );
  // Uncheck the outside of the US and check that state field is visible.
  cy.get(`va-checkbox[name="${checkboxName}"]`)
    .get(`input[type="checkbox"][name="${checkboxName}"]`)
    .uncheck();
  cy.get('va-text-input[name="root_dependentSocialSecurityNumber"]');
  cy.fillVaTextInput('root_dependentSocialSecurityNumber', ssn);
};
