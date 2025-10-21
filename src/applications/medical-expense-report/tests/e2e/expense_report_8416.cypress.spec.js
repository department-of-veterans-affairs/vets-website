import 'cypress-axe';
import fixtureData from '../fixtures/mocks/user.json';
import { checkAxeAndClickContinueButton } from '../utils';

// const loginWithLocalStorage = () => {
//   //cy.visit('pension/medical-expense-report-form-21p-8416/introduction');
//   cy.injectAxeThenAxeCheck()
//   cy.window().then((win) => {
//      win.localStorage.setItem('hasSession', true)
//    });
// };

/**
 * Start the application process while not logged in.
 */
const startApplicationWithoutLogin = () => {
  // cy.log("starting a new test");
  // cy.visit('pension/medical-expense-report-form-21p-8416/introduction');
  cy.visit(
    '/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416',
  );

  cy.injectAxeThenAxeCheck();

  cy.get('va-alert-sign-in')
    // .shadow()
    // .get('a[href="supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416/applicant/relationship"]')
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
  // cy.get('select[name="root_claimantAddress_country"]')
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

const fillInCareExpensesFromFixture = () => {
  // care expenses
  cy.contains('Care expenses');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_typeOfCare', 'RESIDENTIAL');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipients', 'VETERAN');

  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_care_provider_1.providerName,
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
    'root_monthlyPayment',
    fixtureData.data.attributes.veteran_care_provider_1.expenseAmmount,
  );
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:careExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_typeOfCare', 'IN_HOME_CARE_ATTENDANT');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipients', 'SPOUSE');

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
    'root_monthlyPayment',
    fixtureData.data.attributes.veteran_care_provider_2.expenseAmmount,
  );
  cy.fillVaTextInput(
    'root_hourlyRate',
    fixtureData.data.attributes.veteran_care_provider_2.careProviderHoulyRate,
  );
  cy.fillVaTextInput(
    'root_hoursPerWeek',
    fixtureData.data.attributes.veteran_care_provider_2
      .careProviderHoursPerWeek,
  );

  checkAxeAndClickContinueButton();
};

const fillInMedicalExpensesFromFixture = () => {
  cy.contains('Add medical expenses');
  checkAxeAndClickContinueButton();
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:medicalExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipients', 'VETERAN');
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_med_provider_1.providerName,
  );
  checkAxeAndClickContinueButton();

  cy.fillVaTextInput(
    'root_purpose',
    fixtureData.data.attributes.veteran_med_provider_1.medPurpose,
  );
  cy.fillDate(
    'root_paymentDate',
    fixtureData.data.attributes.veteran_med_provider_1.medPaymentDate,
  );
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_paymentFrequency', 'ONCE_MONTH');
  cy.fillVaTextInput(
    'root_paymentAmount',
    fixtureData.data.attributes.veteran_med_provider_1.medPaymentAmount,
  );
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:medicalExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_recipients', 'DEPENDENT');
  cy.fillVaTextInput(
    'root_provider',
    fixtureData.data.attributes.veteran_med_provider_2.providerName,
  );
  cy.fillVaTextInput(
    'root_childName',
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

const fillInMilageExpensesFromFixture = () => {
  cy.contains('Add mileage expenses');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_view:mileageExpensesList', 'Y');
  checkAxeAndClickContinueButton();

  cy.selectRadio('root_traveler', 'VETERAN');
  checkAxeAndClickContinueButton();

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

  cy.selectRadio('root_travelReimbursed', 'Y');
  cy.fillVaTextInput(
    'root_travelReimbursementAmount',
    fixtureData.data.attributes.veteran_milage_1.reimbursementAmount,
  );
  checkAxeAndClickContinueButton();

  // second milage
  cy.selectRadio('root_view:mileageExpensesList', 'Y');
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

const fillInStatementOfTruthFromFixture = () => {
  cy.get('va-statement-of-truth')
    .shadow()
    .get('#veteran-signature')
    .shadow()
    .get('input[name="veteran-signature"')
    .type(
      `${fixtureData.data.attributes.profile.first_name} ${
        fixtureData.data.attributes.profile.middle_name
      } ${fixtureData.data.attributes.profile.last_name}`,
    );
  cy.get('va-statement-of-truth')
    .shadow()
    .get('va-checkbox')
    .shadow()
    .get('input[type="checkbox"]')
    .check();
  cy.injectAxeThenAxeCheck();
  cy.get('va-button[text="Submit application"]').click();
};

const uploadTestFiles = () => {
  cy.get('va-file-input-multiple')
    .shadow()
    .get('va-file-input')
    .get('input[id="fileInputField"][type="file"]')
    .selectFile('../fixtures/data/TestBlankPDF.pdf');
};

describe('Medical Expense Report Form 8416', () => {
  describe('Veteran reporting medical expenses', () => {
    before(() => {
      startApplicationWithoutLogin();
    });
    it('tests Veteran reporting medical expenses path', () => {
      cy.selectRadio('root_claimantNotVeteran', 'Y');
      checkAxeAndClickContinueButton();

      fillInNameFromFixture();
      fillInFullAddressFromFixture();
      fillInEmailAndPhoneFromFixture();
      fillInVetInfoWithoutNameSSNFromFixture();

      // reporting period
      cy.selectRadio('root_firstTimeReporting', 'Y');
      checkAxeAndClickContinueButton();

      fillInCareExpensesFromFixture();
      cy.selectRadio('root_view:careExpensesList', 'N');
      checkAxeAndClickContinueButton();

      fillInMedicalExpensesFromFixture();
      cy.selectRadio('root_view:medicalExpensesList', 'N');
      checkAxeAndClickContinueButton();

      fillInMilageExpensesFromFixture();
      cy.selectRadio('root_view:mileageExpensesList', 'N');
      checkAxeAndClickContinueButton();

      cy.contains('Supporting documents');
      checkAxeAndClickContinueButton();

      cy.contains('Submit your supporting documents');
      // No supporting documents yet
      uploadTestFiles();
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

      // reporting period
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

      // reporting period
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
