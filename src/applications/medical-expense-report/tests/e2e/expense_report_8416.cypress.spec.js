import 'cypress-axe';
import fixtureData from '../fixtures/mocks/user.json';
import {
  checkAxeAndClickContinueButton,
  checkVisibleElementContent,
} from '../utils';

// Commenting this out as it may be used in the next version.
// const loginWithLocalStorage = () => {
//   cy.injectAxeThenAxeCheck();
//   cy.window().then(win => {
//     win.localStorage.setItem('hasSession', true);
//   });
// };

/**
 * Check the content on the intro page for anonymous users.
 */
const checkContentAnonymousIntroPageContent = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('h2', 'Follow these steps to get started:');
  checkVisibleElementContent(
    'va-process-list',
    'What to know before you fill out this form',
  );
  checkVisibleElementContent(
    'va-alert-sign-in',
    'Sign in with a verified account',
  );
};

/**
 * Check content Applicant Information Identity for anonymous uusers
 */
const checkContentAnonymousApplicantInformationIdentity = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent(
    'va-segmented-progress-bar',
    'Applicant information',
  );
  checkVisibleElementContent('legend', 'Your identity');
};

/**
 * Check Content for Applicant Information Name for anonymous users
 */
const checkContentAnonymousApplicantInformationName = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent(
    'va-segmented-progress-bar',
    'Applicant information',
  );
  checkVisibleElementContent('legend', 'Your name');
};

/**
 * Check Content for Applicant Information SSN for anonymous users
 */
const checkContentAnonymousApplicantInformationSSN = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent(
    'va-segmented-progress-bar',
    'Applicant information',
  );
  checkVisibleElementContent('legend', 'Your information');
};

/**
 * Check Content for Applicant Information Mailing Address for anonymous users
 */
const checkContentAnonymousApplicantInformationMailingAddress = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent(
    'va-segmented-progress-bar',
    'Applicant information',
  );
  checkVisibleElementContent('legend', 'Your mailing address');
};

/**
 * Check Content for Applicant Information Email Address and Phone for anonymous users
 */
const checkContentAnonymousApplicantInformationEmail = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent(
    'va-segmented-progress-bar',
    'Applicant information',
  );
  checkVisibleElementContent('legend', 'Your email address and phone number');
};

/**
 * Check Reporting Period page for anonymous users
 */
const checkContentAnonymousReportingPeriod = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Reporting Period');
};

/**
 * Check Reporting Period page for anonymous users
 */
// const checkContentAnonymousCareExpenses = () => {
//   checkVisibleElementContent(
//     'h1',
//     'Submit medical expenses to support a pension or DIC claim'
//   );
//   checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
//   checkVisibleElementContent('legend', 'Care expenses');
// };

/**
 * Check the content on the Care Expenses Add page.
 */
const checkContentAnonymousCareExpensesAdd = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Do you have a care expense to add?');
};

/**
 * Check the content on the Care Expenses Type of Care page
 */
const checkContentAnonymousCareExpensesTypeOfCare = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Select the type of care.');
};

/**
 * Check the content on the Care Expenses Recipient and Provider Name page
 */
const checkContentAnonymousCareExpensesRecipientAndProviderName = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Care recipient and provider name');
};

/**
 * Check the content on the Care Expenses Care Dates page
 */
const checkContentAnonymousCareExpensesCareDates = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Dates of care');
  cy.wait(1000);
  checkVisibleElementContent('va-memorable-date', 'Care start date');
  checkVisibleElementContent('va-memorable-date', 'Care end date');
};

/**
 * Check the content on the Care Expenses Care Costs page
 */
const checkContentAnonymousCareExpensesCareCosts = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Cost of care');
};

/**
 * Check the content on the Care Expenses Review page
 */
const checkContentAnonymousCareExpensesReview = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Review your care expenses');
};

/**
 * Check the content on the Medical Expenses intro page
 */
const checkContentAnonymousMedicalExpenses = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Do you have a medical expense to add?');
};

/**
 * Check the content on the Medical Expenses Recipient and Provider Name page
 */
const checkContentAnonymousMedicalExpensesRecipientAndProviderName = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Medical recipient and provider name');
  checkVisibleElementContent('va-radio', 'Who is the expense for? ');
};

/**
 * Check the content on the Medical Expenses Reason page
 */
const checkContentAnonymousMedicalExpensesReason = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Expense purpose and date');
  checkVisibleElementContent('va-text-input', 'What is the payment for?');
  checkVisibleElementContent(
    'va-memorable-date',
    'What’s the date of the payment?',
  );
};

/**
 * Check the content on the Medical Expenses Frequency page
 */
const checkContentAnonymousMedicalExpensesFrequency = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Frequency and cost of care');
  checkVisibleElementContent('va-radio', 'How often are the payments?');
  checkVisibleElementContent('va-text-input', 'How much is each payment?');
};

/**
 * Check the content on the Medical Expenses Review page
 */
const checkContentAnonymousMedicalExpensesReview = () => {
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
const checkContentAnonymousMilageExpenses = () => {
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
const checkContentAnonymousMilageExpensesTravelerInfo = () => {
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
const checkContentAnonymousMilageExpensesDestination = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Expenses');
  checkVisibleElementContent('legend', 'Expense destination and date');
  checkVisibleElementContent('va-radio', 'What was the destination?');
  checkVisibleElementContent('va-text-input', 'How many miles were travelled?');
  checkVisibleElementContent(
    'va-memorable-date',
    'What was the date of travel?',
  );
};

/**
 * Check the content on the Milage Expenses Reimbursement page
 */
const checkContentAnonymousMilageExpensesReimbursement = () => {
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
const checkContentAnonymousMilageExpensesReview = () => {
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
const checkContentAnonymousStatementOfTruth = () => {
  checkVisibleElementContent(
    'h1',
    'Submit medical expenses to support a pension or DIC claim',
  );
  checkVisibleElementContent('va-segmented-progress-bar', 'Review application');
  checkVisibleElementContent('va-accordion-item', 'Applicant information');
  checkVisibleElementContent('va-accordion-item', 'Expenses');
  checkVisibleElementContent('va-accordion-item', 'Additional information');
  checkVisibleElementContent('va-statement-of-truth', 'Statement of truth');
};

/**
 * Start the application process while not logged in
 */
const startApplicationWithoutLogin = () => {
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
 * Fill in the name fields from the fixture data.
 */
const fillInNameFromFixture = () => {
  cy.get('input[name="root_claimantFullName_first"]').type(
    fixtureData.data.attributes.profile.first_name,
  );
  cy.get('input[name="root_claimantFullName_middle"]').type(
    fixtureData.data.attributes.profile.middle_name,
  );
  cy.get('input[name="root_claimantFullName_last"]').type(
    fixtureData.data.attributes.profile.last_name,
  );
  cy.contains('button', 'Continue').click();
};

/**
 * Fill in Address data from fixture data.
 */
const fillInFullAddressFromFixture = () => {
  cy.get('select[name="root_veteranAddress_country"]').select(
    fixtureData.data.attributes.veteran_address.country,
  );

  cy.get('input[name="root_veteranAddress_street"').type(
    fixtureData.data.attributes.veteran_address.street,
  );
  cy.get('input[name="root_veteranAddress_street2"]').type(
    fixtureData.data.attributes.veteran_address.street2,
  );

  cy.get('.vads-web-component-pattern-address').fillVaTextInput(
    'root_veteranAddress_city',
    fixtureData.data.attributes.veteran_address.city,
  );

  cy.get('va-select')
    .shadow()
    .get('select[name="root_veteranAddress_state"]')
    .select(fixtureData.data.attributes.veteran_address.state);
  cy.get('input[name="root_veteranAddress_postalCode"]').type(
    fixtureData.data.attributes.veteran_address.zip,
  );

  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the Military Base address data from Fixture data and some ad hoc data.
 */
const fillInMilBaseAddressFromFixture = () => {
  cy.get('select[name="root_veteranAddress_country"]').should('have.value', '');
  cy.get('input[name="root_veteranAddress_isMilitary"]').check();
  cy.get('select[name="root_veteranAddress_country"]').should(
    'have.value',
    'USA',
  );
  cy.get('va-radio')
    .shadow()
    .contains('Military post office');
  cy.get('va-radio')
    .shadow()
    .contains('Overseas "state" abbreviation');
  cy.get('input[name="root_veteranAddress_city"][value="APO"]').click();
  cy.get('input[name="root_veteranAddress_state"][value="AE"]').click();

  cy.get('input[name="root_veteranAddress_street"').type(
    fixtureData.data.attributes.veteran_address.street,
  );
  cy.get('input[name="root_veteranAddress_street2"]').type(
    fixtureData.data.attributes.veteran_address.street2,
  );
  cy.get('input[name="root_veteranAddress_postalCode"]').type(
    fixtureData.data.attributes.veteran_address.nonUsZip,
  );

  cy.contains('button', 'Continue').click();
};

/**
 * Fill in the phone data from the fixture.
 */
const fillInEmailAndPhoneFromFixture = () => {
  cy.get('input[name="root_email"').type(
    fixtureData.data.attributes.profile.email,
  );

  cy.get('va-telephone-input[name="root_primaryPhone"]')
    .shadow()
    .get('va-text-input')
    .shadow()
    .get('.va-input-telephone-wrapper')
    .get('input[type="tel"]')
    .type(fixtureData.data.attributes.veteran_address.phone);

  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Vet Info with the name and SSN.
 */
const fillInVetInfoWithNameSSNFromFixture = () => {
  cy.get('input[name="root_veteranFullName_first"]').type(
    fixtureData.data.attributes.profile.first_name,
  );
  cy.get('input[name="root_veteranFullName_middle"]').type(
    fixtureData.data.attributes.profile.middle_name,
  );
  cy.get('input[name="root_veteranFullName_last"]').type(
    fixtureData.data.attributes.profile.last_name,
  );
  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber',
    fixtureData.data.attributes.va_profile.ssn,
  );

  cy.fillVaTextInput(
    'root_vaFileNumber',
    fixtureData.data.attributes.va_profile.vaFileNumber,
  );
  cy.wait(1000);
  cy.fillDate(
    'root_veteranDateOfBirth',
    fixtureData.data.attributes.profile.birth_date,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Vet Info for the vet so we don't need the name.
 */
const fillInVetInfoWithoutNameSSNFromFixture = () => {
  cy.fillVaTextInput(
    'root_veteranSocialSecurityNumber',
    fixtureData.data.attributes.va_profile.ssn,
  );

  cy.fillVaTextInput(
    'root_vaFileNumber',
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
const fillInCareExpensesFromFixture = () => {
  // care expenses
  checkAxeAndClickContinueButton();

  checkContentAnonymousCareExpensesAdd();
  cy.selectRadio('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  checkContentAnonymousCareExpensesTypeOfCare();
  cy.selectRadio('root_typeOfCare', 'RESIDENTIAL');
  checkAxeAndClickContinueButton();

  checkContentAnonymousCareExpensesRecipientAndProviderName();
  cy.selectRadio('root_recipient', 'VETERAN');

  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_care_provider_1.providerName,
  );
  checkAxeAndClickContinueButton();

  // care dates
  checkContentAnonymousCareExpensesCareDates();
  // cypress can be a little too fast and not wait for these fields to be exposed.
  cy.wait(1000);

  cy.fillDate(
    'root_careDate_from',
    fixtureData.data.attributes.veteran_care_provider_1.fromDate,
  );
  cy.fillDate(
    'root_careDate_to',
    fixtureData.data.attributes.veteran_care_provider_1.toDate,
  );
  checkAxeAndClickContinueButton();

  // care expense amount
  checkContentAnonymousCareExpensesCareCosts();
  cy.fillVaTextInput(
    'root_monthlyAmount',
    fixtureData.data.attributes.veteran_care_provider_1.expenseAmmount,
  );
  checkAxeAndClickContinueButton();

  // care expenses
  checkContentAnonymousCareExpensesReview();
  cy.selectRadio('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_typeOfCare', 'IN_HOME_CARE_ATTENDANT');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipient', 'SPOUSE');

  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_care_provider_2.providerName,
  );
  checkAxeAndClickContinueButton();

  cy.fillDate(
    'root_careDate_from',
    fixtureData.data.attributes.veteran_care_provider_1.fromDate,
  );
  cy.fillDate(
    'root_careDate_to',
    fixtureData.data.attributes.veteran_care_provider_1.toDate,
  );
  checkAxeAndClickContinueButton();

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
const fillInMedicalExpensesFromFixture = () => {
  cy.contains('Add medical expenses');
  checkAxeAndClickContinueButton();

  checkContentAnonymousMedicalExpenses();
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:medicalExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  checkContentAnonymousMedicalExpensesRecipientAndProviderName();
  cy.selectRadio('root_recipient', 'VETERAN');
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_med_provider_1.providerName,
  );
  checkAxeAndClickContinueButton();

  checkContentAnonymousMedicalExpensesReason();

  cy.fillVaTextInput(
    'root_purpose',
    fixtureData.data.attributes.veteran_med_provider_1.medPurpose,
  );
  cy.fillDate(
    'root_paymentDate',
    fixtureData.data.attributes.veteran_med_provider_1.medPaymentDate,
  );
  checkAxeAndClickContinueButton();

  checkContentAnonymousMedicalExpensesFrequency();
  cy.selectRadio('root_paymentFrequency', 'ONCE_MONTH');
  cy.fillVaTextInput(
    'root_paymentAmount',
    fixtureData.data.attributes.veteran_med_provider_1.medPaymentAmount,
  );
  checkAxeAndClickContinueButton();

  checkContentAnonymousMedicalExpensesReview();
  cy.selectRadio('root_view:medicalExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipient', 'DEPENDENT');
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_med_provider_2.providerName,
  );
  cy.fillVaTextInput(
    'root_recipientName',
    fixtureData.data.attributes.veteran_med_provider_2.medPatient,
  );
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_med_provider_2.providerName,
  );
  checkAxeAndClickContinueButton();

  cy.fillVaTextInput(
    'root_purpose',
    fixtureData.data.attributes.veteran_med_provider_2.medPurpose,
  );
  cy.fillDate(
    'root_paymentDate',
    fixtureData.data.attributes.veteran_med_provider_2.medPaymentDate,
  );
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_paymentFrequency', 'ONCE_MONTH');
  cy.fillVaTextInput(
    'root_paymentAmount',
    fixtureData.data.attributes.veteran_med_provider_2.medPaymentAmount,
  );
  checkAxeAndClickContinueButton();
};

/**
 * Fill in the Milage/Travel Expenses from the Fixture data.
 */
const fillInMilageExpensesFromFixture = () => {
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
    'root_travelLocationOther',
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
const fillInStatementOfTruthFromFixture = () => {
  cy.get('va-statement-of-truth')
    .shadow()
    .get('va-checkbox')
    .shadow()
    .get('input[type="checkbox"]')
    .check();

  const fullName =
    fixtureData.data.attributes.profile.first_name +
    ' ' +
    fixtureData.data.attributes.profile.middle_name +
    ' ' +
    fixtureData.data.attributes.profile.last_name;
  cy.get('va-statement-of-truth')
    .shadow()
    .get('#veteran-signature')
    .shadow()
    .get('input[name="veteran-signature"')
    .type(fullName);

  checkContentAnonymousStatementOfTruth();
  cy.injectAxeThenAxeCheck();
  cy.get('button[class="usa-button-primary"]').click();
};

/**
 * Upload a test file.
 */
const uploadTestFiles = () => {
  cy.get('va-file-input-multiple')
    .shadow()
    .get('va-file-input')
    .get('input[id="fileInputField"][type="file"]')
    .selectFile(
      'src/applications/medical-expense-report/tests/fixtures/data/TestBlankPDF.pdf',
    );
};

describe('Medical Expense Report Form 8416', () => {
  describe('Veteran reporting medical expenses', () => {
    before(() => {
      startApplicationWithoutLogin();
    });
    it('tests Veteran reporting medical expenses path', () => {
      // Applicant Information identity
      checkContentAnonymousApplicantInformationIdentity();
      cy.selectRadio('root_claimantNotVeteran', 'Y');
      checkAxeAndClickContinueButton();

      // Applicant Information name
      checkContentAnonymousApplicantInformationName();
      fillInNameFromFixture();
      checkContentAnonymousApplicantInformationMailingAddress();
      fillInFullAddressFromFixture();
      checkContentAnonymousApplicantInformationEmail();

      fillInEmailAndPhoneFromFixture();
      checkContentAnonymousApplicantInformationSSN();
      fillInVetInfoWithoutNameSSNFromFixture();

      // Reporting period
      checkContentAnonymousReportingPeriod();
      cy.selectRadio('root_firstTimeReporting', 'Y');
      checkAxeAndClickContinueButton();

      checkAxeAndClickContinueButton();

      // Care Expenses
      fillInCareExpensesFromFixture();
      cy.selectRadio('root_view:careExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Medical Expenses
      fillInMedicalExpensesFromFixture();
      cy.selectRadio('root_view:medicalExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Milage Expenses
      fillInMilageExpensesFromFixture();
      cy.selectRadio('root_view:mileageExpensesList', 'N');

      checkAxeAndClickContinueButton();
      cy.contains('Supporting documents');
      checkAxeAndClickContinueButton();

      cy.contains('Submit your supporting documents');
      // No supporting documents yet
      checkAxeAndClickContinueButton();

      // Statement of Truth
      fillInStatementOfTruthFromFixture();
    });
  });

  describe('Spouse or Child of Veteran medical expenses path', () => {
    before(() => {
      startApplicationWithoutLogin();
    });

    it('tests Veteran Spouse reporting medical expenses path', () => {
      cy.selectRadio('root_claimantNotVeteran', 'N');
      checkAxeAndClickContinueButton();

      fillInNameFromFixture();
      fillInFullAddressFromFixture();

      fillInEmailAndPhoneFromFixture();

      fillInVetInfoWithNameSSNFromFixture();

      // Reporting period
      cy.selectRadio('root_firstTimeReporting', 'Y');
      checkAxeAndClickContinueButton();

      fillInCareExpensesFromFixture();

      cy.selectRadio('root_view:careExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Medical expenses
      fillInMedicalExpensesFromFixture();

      cy.selectRadio('root_view:medicalExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Milage expenses
      fillInMilageExpensesFromFixture();

      cy.selectRadio('root_view:mileageExpensesList', 'N');
      checkAxeAndClickContinueButton();

      checkAxeAndClickContinueButton();

      cy.contains('Submit your supporting documents');
      // No supporting documents yet
      checkAxeAndClickContinueButton();

      // Statement of Truth
      fillInStatementOfTruthFromFixture();
    });
  });

  describe('Veteran reporting medical expenses path on foreign base', () => {
    before(() => {
      startApplicationWithoutLogin();
    });

    it('tests Veteran reporting medical expenses path', () => {
      cy.selectRadio('root_claimantNotVeteran', 'N');
      checkAxeAndClickContinueButton();

      fillInNameFromFixture();
      fillInMilBaseAddressFromFixture();

      fillInEmailAndPhoneFromFixture();

      fillInVetInfoWithNameSSNFromFixture();

      // Reporting period
      cy.selectRadio('root_firstTimeReporting', 'Y');
      checkAxeAndClickContinueButton();

      fillInCareExpensesFromFixture();

      cy.selectRadio('root_view:careExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Medical expenses
      fillInMedicalExpensesFromFixture();

      cy.selectRadio('root_view:medicalExpensesList', 'N');
      checkAxeAndClickContinueButton();

      // Milage expenses
      fillInMilageExpensesFromFixture();

      cy.selectRadio('root_view:mileageExpensesList', 'N');
      checkAxeAndClickContinueButton();

      checkAxeAndClickContinueButton();

      cy.contains('Submit your supporting documents');
      // No supporting documents yet
      checkAxeAndClickContinueButton();

      // Statement of Truth
      fillInStatementOfTruthFromFixture();
    });
  });
});
