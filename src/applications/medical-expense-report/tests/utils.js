import fixtureData from './fixtures/mocks/user.json';

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
  cy.findByRole('heading', {
    level: 1,
    name: 'Submit medical expenses to support a pension or DIC claim',
  }).should('exist');
  cy.findByRole('heading', {
    level: 2,
    name: 'Follow these steps to get started:',
  }).should('exist');
  cy.findByText('What to know before you fill out this form').should('exist');
  cy.get('va-alert-sign-in')
    .shadow()
    .within(() => {
      cy.findByText('Sign in with a verified account').should('exist');
    });
};

/**
 * Start the application process while not logged in
 */
export const startApplicationWithoutLogin = () => {
  cy.visit(
    '/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416',
  );

  cy.injectAxeThenAxeCheck();
  checkContentAnonymousIntroPageContent();

  cy.get('va-alert-sign-in')
    .get('a[class="schemaform-start-button"]')
    .click();
};

/**
 * Check content Applicant Information Identity for anonymous uusers
 */
export const checkContentAnonymousApplicantInformationIdentity = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Your information');
  checkVisibleElementContent('legend', 'Your identity');
};

/**
 * Check Content for Applicant Information Name for anonymous users
 */
export const checkContentAnonymousApplicantInformationName = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Your information');
  checkVisibleElementContent('legend', 'Your name');
};

/**
 * Check Content for Applicant Information SSN for anonymous users
 */
export const checkContentAnonymousApplicantInformationSSN = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Your information');
  checkVisibleElementContent('legend', 'Your identification information');
};

/**
 * Check Content for Applicant Information Mailing Address for anonymous users
 */
export const checkContentAnonymousApplicantInformationMailingAddress = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Your information');
  checkVisibleElementContent('legend', 'Your mailing address');
};

/**
 * Check Content for Applicant Information Email Address and Phone for anonymous users
 */
export const checkContentAnonymousApplicantInformationEmail = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Your information');
  checkVisibleElementContent('legend', 'Your email address and phone number');
};

/**
 * Check Reporting Period page for anonymous users
 */
export const checkContentAnonymousReportingPeriod = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
};

/**
 * Check the content on the Medical Expenses Recipient and Provider Name page
 */
export const checkContentAnonymousMedicalExpensesRecipientAndProviderName = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Medical recipient');
  checkVisibleElementContent('va-radio', 'Who’s the expense for?');
};

/**
 * Check the content on the Medical Expenses Reason page
 */
export const checkContentAnonymousMedicalExpensesReason = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Expense recipient and purpose');
  checkVisibleElementContent('va-text-input', 'Who receives the payment?');
  checkVisibleElementContent('va-text-input', 'What is the payment for?');
};

/**
 * Check the content on the Medical Expenses Frequency page
 */
export const checkContentAnonymousMedicalExpensesFrequency = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Frequency and cost of care');
  checkVisibleElementContent('va-radio', 'How often do you make this payment?');
  checkVisibleElementContent('va-text-input', 'How much is each payment?');
};

/**
 * Check the content on the Medical Expenses Review page
 */
export const checkContentAnonymousMedicalExpensesReview = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Review your medical expenses');
  checkVisibleElementContent(
    'va-radio',
    'Do you have another medical expense to add?',
  );
};

/**
 * Check the content on the Milage Expenses intro page
 */
export const checkContentAnonymousMilageExpenses = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent(
    'va-radio',
    'Do you have a mileage expense to add?',
  );
};

/**
 * Check the content on the Milage Expenses Traveler Infro page
 */
export const checkContentAnonymousMilageExpensesTravelerInfo = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Traveler information');
  checkVisibleElementContent('va-radio', 'Who needed to travel?');
};
/**
 * Check the content on the Milage Expenses Destination page
 */
export const checkContentAnonymousMilageExpensesDestination = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Expense destination and date');
  checkVisibleElementContent('va-radio', 'What was the destination?');
  checkVisibleElementContent('va-text-input', 'How many miles were traveled?');
  checkVisibleElementContent(
    'va-memorable-date',
    'What was the date of travel?',
  );
};

/**
 * Check the content on the Milage Expenses Reimbursement page
 */
export const checkContentAnonymousMilageExpensesReimbursement = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Expense reimbursement');
  checkVisibleElementContent(
    'va-radio',
    'Has this mileage been reimbursed by any other source?',
  );
};

/**
 * Check the content on the Milage Expenses Review page
 */
export const checkContentAnonymousMilageExpensesReview = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');

  checkVisibleElementContent(
    'va-radio',
    'Do you have another mileage expense to add?',
  );
};

/**
 * Check the content on the Statement of Truth page
 */
export const checkContentAnonymousStatementOfTruth = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Review application');
  checkVisibleElementContent('va-accordion-item', 'Your information');
  checkVisibleElementContent('va-accordion-item', 'Expenses');
  checkVisibleElementContent('va-accordion-item', 'Additional information');
  checkVisibleElementContent('va-statement-of-truth', 'Statement of truth');
};

/**
 * Fill in the name fields from the fixture data.
 */
export const fillInNameFromFixture = () => {
  cy.fillVaTextInput(
    'root_claimantFullName_first',
    fixtureData.data.attributes.profile.first_name,
  );
  cy.fillVaTextInput(
    'root_claimantFullName_middle',
    fixtureData.data.attributes.profile.middle_name,
  );
  cy.fillVaTextInput(
    'root_claimantFullName_last',
    fixtureData.data.attributes.profile.last_name,
  );
  cy.findByRole('button', { name: /Continue/i }).click();
};

/**
 * Fill in Address data from fixture data.
 */
export const fillInFullAddressFromFixture = () => {
  cy.selectVaSelect(
    'root_claimantAddress_country',
    fixtureData.data.attributes.veteran_address.country,
  );
  cy.fillVaTextInput(
    'root_claimantAddress_street',
    fixtureData.data.attributes.veteran_address.street,
  );
  cy.fillVaTextInput(
    'root_claimantAddress_street2',
    fixtureData.data.attributes.veteran_address.street2,
  );
  cy.fillVaTextInput(
    'root_claimantAddress_city',
    fixtureData.data.attributes.veteran_address.city,
  );
  cy.selectVaSelect(
    'root_claimantAddress_state',
    fixtureData.data.attributes.veteran_address.state,
  );
  cy.fillVaTextInput(
    'root_claimantAddress_postalCode',
    fixtureData.data.attributes.veteran_address.zip,
  );
  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the Military Base address data from Fixture data and some ad hoc data.
 */
export const fillInMilBaseAddressFromFixture = () => {
  cy.get('select[name="root_claimantAddress_country"]').should(
    'have.value',
    '',
  );
  cy.get('input[name="root_claimantAddress_isMilitary"]').check();
  cy.get('select[name="root_claimantAddress_country"]').should(
    'have.value',
    'USA',
  );
  cy.get('va-radio')
    .shadow()
    .contains('Military post office');
  cy.get('va-radio')
    .shadow()
    .contains('Overseas "state" abbreviation');
  cy.get('input[name="root_claimantAddress_city"][value="APO"]').click();
  cy.get('input[name="root_claimantAddress_state"][value="AE"]').click();

  cy.get('input[name="root_claimantAddress_street"').type(
    fixtureData.data.attributes.veteran_address.street,
  );
  cy.get('input[name="root_claimantAddress_street2"]').type(
    fixtureData.data.attributes.veteran_address.street2,
  );
  cy.get('input[name="root_claimantAddress_postalCode"]').type(
    fixtureData.data.attributes.veteran_address.nonUsZip,
  );

  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the phone data from the fixture.
 */
export const fillInEmailAndPhoneFromFixture = () => {
  cy.fillVaTextInput('root_email', fixtureData.data.attributes.profile.email);
  cy.fillVaTelephoneInput('root_primaryPhone', {
    contact: fixtureData.data.attributes.veteran_address.phone,
  });
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Vet Info with the name and SSN.
 */
export const fillInVetInfoWithNameSSNFromFixture = () => {
  cy.fillVaTextInput(
    'root_veteranFullName_first',
    fixtureData.data.attributes.profile.first_name,
  );
  cy.fillVaTextInput(
    'root_veteranFullName_middle',
    fixtureData.data.attributes.profile.middle_name,
  );
  cy.fillVaTextInput(
    'root_veteranFullName_last',
    fixtureData.data.attributes.profile.last_name,
  );
  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_ssn',
    fixtureData.data.attributes.va_profile.ssn,
  );

  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_vaFileNumber',
    fixtureData.data.attributes.va_profile.vaFileNumber,
  );
  cy.fillVaMemorableDate(
    'root_veteranDateOfBirth',
    fixtureData.data.attributes.profile.birth_date,
    false,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Vet Info for the vet so we don't need the name.
 */
export const fillInVetInfoWithoutNameSSNFromFixture = () => {
  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_ssn',
    fixtureData.data.attributes.va_profile.ssn,
  );

  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber_vaFileNumber',
    fixtureData.data.attributes.va_profile.vaFileNumber,
  );
  cy.fillDate(
    'root_veteranDateOfBirth',
    fixtureData.data.attributes.profile.birth_date,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Care Expenses from the Fixture data.
 */
export const fillInCareExpensesFromFixture = () => {
  // care expenses
  cy.findByRole('heading', {
    level: 3,
    name: 'Care expenses',
  }).should('exist');
  checkAxeAndClickContinueButton();
  cy.selectYesNoVaRadioOption('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.findByRole('heading', {
    level: 3,
    name: 'Type of care',
  }).should('exist');
  cy.selectRadio('root_typeOfCare', 'RESIDENTIAL');
  checkAxeAndClickContinueButton();

  cy.findByRole('heading', {
    level: 3,
    name: 'Care recipient',
  }).should('exist');
  cy.selectRadio('root_recipient', 'VETERAN');

  checkAxeAndClickContinueButton();

  cy.findByRole('heading', {
    level: 3,
    name: 'Care provider’s name and dates of care',
  }).should('exist');
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_care_provider_1.providerName,
  );

  cy.fillDate(
    'root_careDate_from',
    fixtureData.data.attributes.veteran_care_provider_1.fromDate,
  );
  cy.fillDate(
    'root_careDate_to',
    fixtureData.data.attributes.veteran_care_provider_1.toDate,
  );

  checkAxeAndClickContinueButton();
  cy.findByRole('heading', {
    level: 3,
    name: `Cost of care for ${
      fixtureData.data.attributes.veteran_care_provider_1.providerName
    }`,
  }).should('exist');
  cy.fillVaTextInput(
    'root_monthlyAmount',
    fixtureData.data.attributes.veteran_care_provider_1.expenseAmmount,
  );
  checkAxeAndClickContinueButton();

  cy.findByRole('heading', {
    level: 3,
    name: 'Review your care expenses',
  }).should('exist');

  // Add another care expense
  cy.selectRadio('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_typeOfCare', 'IN_HOME_CARE_ATTENDANT');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipient', 'SPOUSE');

  checkAxeAndClickContinueButton();

  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_care_provider_2.providerName,
  );

  cy.fillDate(
    'root_careDate_from',
    fixtureData.data.attributes.veteran_care_provider_1.fromDate,
  );
  cy.fillDate(
    'root_careDate_to',
    fixtureData.data.attributes.veteran_care_provider_1.toDate,
  );
  checkAxeAndClickContinueButton();
  cy.findByRole('heading', {
    level: 3,
    name: `Cost of care for ${
      fixtureData.data.attributes.veteran_care_provider_2.providerName
    }`,
  }).should('exist');
  cy.fillVaTextInput(
    'root_monthlyAmount',
    fixtureData.data.attributes.veteran_care_provider_2.expenseAmmount,
  );
  cy.fillVaTextInput(
    'root_hourlyRate',
    fixtureData.data.attributes.veteran_care_provider_2.careProviderHoulyRate,
  );
  cy.fillVaTextInput(
    'root_weeklyHours',
    fixtureData.data.attributes.veteran_care_provider_2
      .careProviderHoursPerWeek,
  );

  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Medical Expenses from the Fixture data.
 */
export const fillInMedicalExpensesFromFixture = () => {
  cy.findByRole('heading', {
    level: 3,
    name: 'Medical expenses',
  }).should('exist');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:medicalExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  // checkContentAnonymousMedicalExpensesRecipientAndProviderName();
  // cy.selectRadio('root_recipient', 'VETERAN');

  // checkAxeAndClickContinueButton();

  // cy.fillVaTextInput(
  //   'root_provider',
  //   fixtureData.data.attributes.veteran_med_provider_1.providerName,
  // );
  // cy.fillVaTextInput(
  //   'root_purpose',
  //   fixtureData.data.attributes.veteran_med_provider_1.medPurpose,
  // );
  // checkContentAnonymousMedicalExpensesReason();

  // checkAxeAndClickContinueButton();

  // checkContentAnonymousMedicalExpensesFrequency();
  // cy.selectRadio('root_paymentFrequency', 'ONCE_MONTH');
  // cy.fillVaTextInput(
  //   'root_paymentAmount',
  //   fixtureData.data.attributes.veteran_med_provider_1.medPaymentAmount,
  // );
  // cy.get('va-memorable-date[name="root_paymentDate"]')
  //   .shadow()
  //   .get('input[name="root_paymentDateMonth"]:not([disabled]')
  //   .then(() => {
  //     cy.fillDate(
  //       'root_paymentDate',
  //       fixtureData.data.attributes.veteran_med_provider_1.medPaymentDate,
  //     );
  //   });
  // checkAxeAndClickContinueButton();

  // checkContentAnonymousMedicalExpensesReview();
  // cy.selectRadio('root_view:medicalExpensesList', 'Y');
  // checkAxeAndClickContinueButton();

  // cy.selectRadio('root_recipient', 'CHILD');
  // cy.fillVaTextInput(
  //   'root_fullNameRecipient',
  //   fixtureData.data.attributes.veteran_med_provider_2.medPatient,
  // );

  // checkAxeAndClickContinueButton();

  // cy.fillVaTextInput(
  //   'root_provider',
  //   fixtureData.data.attributes.veteran_med_provider_2.providerName,
  // );
  // cy.fillVaTextInput(
  //   'root_purpose',
  //   fixtureData.data.attributes.veteran_med_provider_2.medPurpose,
  // );
  // checkAxeAndClickContinueButton();

  // cy.selectRadio('root_paymentFrequency', 'ONCE_MONTH');
  // cy.fillVaTextInput(
  //   'root_paymentAmount',
  //   fixtureData.data.attributes.veteran_med_provider_2.medPaymentAmount,
  // );
  // cy.get('va-memorable-date[name="root_paymentDate"]')
  //   .shadow()
  //   .get('input[name="root_paymentDateMonth"]:not([disabled]')
  //   .then(() => {
  //     cy.fillDate(
  //       'root_paymentDate',
  //       fixtureData.data.attributes.veteran_med_provider_2.medPaymentDate,
  //     );
  //   });
  // checkAxeAndClickContinueButton();
};

/**
 * Fill in the Milage/Travel Expenses from the Fixture data.
 */
export const fillInMilageExpensesFromFixture = () => {
  cy.contains('Mileage expenses');
  checkAxeAndClickContinueButton();

  checkContentAnonymousMilageExpenses();
  cy.selectRadio('root_view:mileageExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  checkContentAnonymousMilageExpensesTravelerInfo();
  cy.selectRadio('root_traveler', 'VETERAN');
  checkAxeAndClickContinueButton();

  checkContentAnonymousMilageExpensesDestination();
  cy.selectRadio(
    'root_travelLocation',
    fixtureData.data.attributes.veteran_milage_1.travelDestination,
  );
  cy.fillVaTextInput(
    'root_travelMilesTraveled',
    fixtureData.data.attributes.veteran_milage_1.milesTraveled,
  );
  cy.fillDate(
    'root_travelDate',
    fixtureData.data.attributes.veteran_milage_1.dateTraveled,
  );
  checkAxeAndClickContinueButton();

  checkContentAnonymousMilageExpensesReimbursement();
  cy.selectRadio('root_travelReimbursed', 'Y');
  checkVisibleElementContent('va-text-input', 'How much money was reimbursed?');
  cy.fillVaTextInput(
    'root_travelReimbursementAmount',
    fixtureData.data.attributes.veteran_milage_1.reimbursementAmount,
  );
  checkAxeAndClickContinueButton();

  // second milage
  cy.selectRadio('root_view:mileageExpensesList', 'Y');
  checkContentAnonymousMilageExpensesReview();
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_traveler', 'VETERAN');
  checkAxeAndClickContinueButton();

  cy.selectRadio(
    'root_travelLocation',
    fixtureData.data.attributes.veteran_milage_2.travelDestination,
  );
  cy.fillVaTextInput(
    'root_otherTravelLocation',
    fixtureData.data.attributes.veteran_milage_2.travelLocationOther,
  );
  cy.fillVaTextInput(
    'root_travelMilesTraveled',
    fixtureData.data.attributes.veteran_milage_2.milesTraveled,
  );
  cy.fillDate(
    'root_travelDate',
    fixtureData.data.attributes.veteran_milage_2.dateTraveled,
  );
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_travelReimbursed', 'Y');
  cy.fillVaTextInput(
    'root_travelReimbursementAmount',
    fixtureData.data.attributes.veteran_milage_2.reimbursementAmount,
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

  checkContentAnonymousStatementOfTruth();
  cy.injectAxeThenAxeCheck();
  // cy.get('button[class="usa-button-primary"]').click();
};

/**
 * Upload a test file. To be used later.
 */
export const uploadTestFiles = () => {
  cy.get('va-file-input-multiple')
    .shadow()
    .get('va-file-input[id="instance-0"]')
    .get('input[id="fileInputField"][type="file"][name="root_files-0"]')
    .selectFile(
      'src/applications/medical-expense-report/tests/fixtures/data/TestBlankPDF.pdf',
      { force: true },
    );
  cy.contains('TestBlankPDF.pdf');

  cy.get('va-file-input-multiple')
    .shadow()
    .get('va-file-input[id="instance-1"]')
    .get('input[id="fileInputField"][type="file"][name="root_files-1"]')
    .selectFile(
      'src/applications/medical-expense-report/tests/fixtures/data/TestBlankJPG.jpg',
      { force: true },
    );
  cy.contains('TestBlankJPG.jpg');
  cy.get('va-file-input-multiple')
    .shadow()
    .get('va-file-input[id="instance-2"]')
    .get('input[id="fileInputField"][type="file"][name="root_files-2"]')
    .selectFile(
      'src/applications/medical-expense-report/tests/fixtures/data/TestBlankPNG.png',
      { force: true },
    );
  cy.contains('TestBlankPNG.png');
};
