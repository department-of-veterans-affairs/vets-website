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
    'Determine which benefits to apply for',
  );
  checkVisibleElementContent('va-process-list', 'Gather your information');
  checkVisibleElementContent('va-process-list', 'Start your application');
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
  checkVisibleElementContent('va-text-input', 'Service number');
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
    'Has the Veteran, surviving spouse, child, or parent ever filed a claim with the VA?',
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
  checkVisibleElementContent(
    'va-radio',
    'What is the claimant’s relationship to the Veteran?',
  );
  checkVisibleElementContent('va-text-input', 'First or given name');
  checkVisibleElementContent('va-text-input', 'Middle name');
  checkVisibleElementContent('va-text-input', 'Last or family name');
  checkVisibleElementContent('va-select', 'Suffix');
  checkVisibleElementContent('va-text-input', 'Social Security number');
  checkVisibleElementContent('va-memorable-date', 'Date of birth');
  checkVisibleElementContent('va-radio', 'Is the claimant a Veteran? ');
};

/**
 * Check the content for the Claimant's Address information page
 */
export const checkContentClaimantsInfoAddress = () => {
  checkVisibleElementContent(
    'h1',
    'Apply for DIC, Survivors Pension, or accrued benefits online',
  );
  checkVisibleElementContent('legend', 'Your mailing address');
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
  checkVisibleElementContent('legend', 'Veteran’s previous marriages');
  checkVisibleElementContent(
    'form',
    'Next we’ll ask you about the Veteran’s previous marriages. You may add up to 2 marriages.',
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
    'Was the Veteran married to someone else before being married to you?',
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
    'Next we’ll ask you about the Veteran’s dependent children. You may add up to 3 dependents.',
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
    'Do you and your dependents have over $25,000 in assets?',
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
    'Do you have a medical, last, burial, or other expense to add?',
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
 * Fill in the name fields from the fixture data.
 */
export const fillInNameFromFixture = () => {
  cy.get('va-text-input[name="root_veteranFullName_first"]')
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
    'root_veteranSocialSecurityNumber',
    fixtureData.data.attributes.profile.ssn,
  );

  cy.fillVaTextInput(
    'root_veteranVAFileNumber',
    fixtureData.data.attributes.profile.vaFileNumber,
  );
  cy.fillVaTextInput(
    'root_veteranServiceNumber',
    fixtureData.data.attributes.profile.serviceNumber,
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
 * Fill in the spouse/laimantrelationship data
 */
export const fillInClaimantsRelationshipDataFromFixture = () => {
  cy.selectRadio('root_claimantRelationship', 'SPOUSE');
  cy.get('input[name="root_claimantFullName_first"]').type(
    fixtureData.data.attributes.spouseData.first_name,
  );
  cy.get('input[name="root_claimantFullName_middle"]').type(
    fixtureData.data.attributes.spouseData.middle_name,
  );
  cy.get('input[name="root_claimantFullName_last"]').type(
    fixtureData.data.attributes.spouseData.last_name,
  );
  cy.fillVaTextInput(
    'root_claimantSocialSecurityNumber',
    fixtureData.data.attributes.spouseData.ssn,
  );
  cy.fillDate(
    'root_claimantDateOfBirth',
    fixtureData.data.attributes.spouseData.birth_date,
  );
  cy.selectRadio('root_claimantIsVeteran', 'Y');
  checkAxeAndClickContinueButton();
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
 * @param {*} claimsBenefits - The array of elements to check.
 */
export const checkVaCheckbox = (checkboxName, claimsBenefits) => {
  if (typeof claimsBenefits !== 'undefined') {
    claimsBenefits.forEach(claimName => {
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
