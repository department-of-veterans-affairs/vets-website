import fixtureData from '../fixtures/mocks/user.json';

const loginWithLocalStorage = featureToggles => {
  cy.visit('pension/medical-expense-report-form-21p-8416/applicant/claimant');

  cy.window().then((win) => {
    win.localStorage.setItem('hasSession', true)
  });
};

const fillInNameFromFixture = nameData => {
  cy.get('input[name="root_claimantFullName_first"]')
    .type(fixtureData.data.attributes.profile.first_name);
  cy.get('input[name="root_claimantFullName_middle"]')
    .type(fixtureData.data.attributes.profile.middle_name);
  cy.get('input[name="root_claimantFullName_last"]')
    .type(fixtureData.data.attributes.profile.last_name);
  
  cy.contains('button', 'Continue')
    .click()
};

const fillInFullAddressFromFixutre = addressData => {
  cy.get('select[name="root_claimantAddress_country"]')
    .select(fixtureData.data.attributes.veteran_address.country)

  cy.get('input[name="root_claimantAddress_street"')
    .type(fixtureData.data.attributes.veteran_address.street);
  cy.get('input[name="root_claimantAddress_street2"]')
    .type(fixtureData.data.attributes.veteran_address.street2);

  cy.get('.vads-web-component-pattern-address')
    .get('va-text-input[name="root_claimantAddress_city"]')
    .shadow()
    .get('input[name="root_claimantAddress_city"]')
    .as('addressInput').type(fixtureData.data.attributes.veteran_address.city);

  cy.get('va-select').shadow()
    .get('select[name="root_claimantAddress_state"]')
    .select("OH"); 
  cy.get('input[name="root_claimantAddress_postalCode"]')
    .type(fixtureData.data.attributes.veteran_address.zip);

  cy.contains('button', 'Continue').click()

};

const fillInMilBaseAddressFromFixutre = addressData => {
  cy.get('select[name="root_claimantAddress_country"]')
    .should('have.value', '');
  cy.get('input[name="root_claimantAddress_isMilitary"]')
    .check();
  cy.get('select[name="root_claimantAddress_country"]')
    .should('have.value', 'USA');
  cy.get('va-radio').shadow()
    .contains('Military post office');
  cy.get('va-radio')
    .shadow()
    .contains('Overseas "state" abbreviation');
  cy.get('input[name="root_claimantAddress_city"][value="APO"]')
    .click();
  cy.get('input[name="root_claimantAddress_state"][value="AE"]')
    .click();

  cy.get('input[name="root_claimantAddress_street"')
    .type(fixtureData.data.attributes.veteran_address.street);
  cy.get('input[name="root_claimantAddress_street2"]')
    .type(fixtureData.data.attributes.veteran_address.street2);
  cy.get('input[name="root_claimantAddress_postalCode"]')
    .type(fixtureData.data.attributes.veteran_address.zip);

  cy.contains('button', 'Continue')
    .click()

};

const fillInEmailAndPhoneFromFixture = contactData => {
  cy.get('input[name="root_email"')
    .type(fixtureData.data.attributes.profile.email);

  cy.get('va-telephone-input[name="root_primaryPhone"]')
    .shadow()
    .get('va-text-input')
    .shadow()
    .get('.va-input-telephone-wrapper')
    .get('input[type="tel"]')
    .type(fixtureData.data.attributes.veteran_address.phone);


  cy.contains('button', 'Continue')
    .click();
};

const fillInVetInformationFromFixture = vetInfo => {

  cy.get('input[name="root_veteranFullName_first"]')
    .type(fixtureData.data.attributes.profile.first_name);
  cy.get('input[name="root_veteranFullName_middle"]')
    .type(fixtureData.data.attributes.profile.middle_name);
  cy.get('input[name="root_veteranFullName_last"]')
    .type(fixtureData.data.attributes.profile.last_name);

  cy.get('va-text-input[name="root_veteranSocialSecurityNumber"]')
    .shadow()
    .get('input[name="root_veteranSocialSecurityNumber"]')
    .type('012-34-5678');

  cy.get('va-text-input[name="root_vaFileNumber"]')
    .shadow()
    .get('input[name="root_vaFileNumber"]')
    .type('123456789');

  const vetsBirthdate = fixtureData.data.attributes.profile.birth_date.split('-');
  cy.get('va-memorable-date[name="root_veteranDateOfBirth"]')
    .shadow()
    .get('input[name="root_veteranDateOfBirthMonth"')
    .type(vetsBirthdate[1]);

  cy.get('va-memorable-date[name="root_veteranDateOfBirth"]')
    .shadow()
    .get('input[name="root_veteranDateOfBirthDay"')
    .type(vetsBirthdate[2])

  cy.get('va-memorable-date[name="root_veteranDateOfBirth"]')
    .shadow()
    .get('input[name="root_veteranDateOfBirthYear"')
    .type(vetsBirthdate[0])
  
  cy.contains('button', 'Continue')
    .click();
}

const fillInCareExpensesFromFixture  = careData => {
  cy.get('va-radio[name="root_careExpenses_0_recipients"]')
    .shadow()
    .get('va-radio-option[value="VETERAN"]')
    .get('input[type="radio"]')
    .click();
}

const fillInReportingPeriodFromFixture = reportingData => {

  // const radioOptions = {
  //   radioName : "root_firstTimeReporting",
  //   radioValue : "Y"
  // }
  // clickVaRadio(radioOptions);

  cy.get('va-memorable-date[name="root_reportingPeriod_from"]')
    .shadow()
    .get('input[name="root_reportingPeriod_fromYear"')
    .type("1985");
  cy.get('va-memorable-date[name="root_reportingPeriod_from"]')
    .shadow()
    .get('select[name="root_reportingPeriod_fromMonth"')
    .select("9");
  cy.get('va-memorable-date[name="root_reportingPeriod_from"]')
    .shadow()
    .get('input[name="root_reportingPeriod_fromDay"')
    .type("01");
  
  cy.get('va-memorable-date[name="root_reportingPeriod_to"]')
    .shadow()
    .get('input[name="root_reportingPeriod_toYear"')
    .type("2020");
  cy.get('va-memorable-date[name="root_reportingPeriod_to"]')
    .shadow()
    .get('select[name="root_reportingPeriod_toMonth"')
    .select("10");
  cy.get('va-memorable-date[name="root_reportingPeriod_to"]')
    .shadow()
    .get('input[name="root_reportingPeriod_toDay"')
    .type("30");

  cy.contains('button', 'Continue')
    .click();
}

const clickVaRadio = options => {
  cy.get('va-radio[name="' + options.radioName + '"]')
    .shadow()
    .get('va-radio-option[value="' + options.radioValue + '"]')
    .get('input[type="radio"][value="' + options.radioValue + '"]')
    .click();
}
describe('Medical Expense Report Form 8416', () => {
  
  // describe('Spouse or Child of Veteran', () => {
  //   before(() => {
  //     loginWithLocalStorage();
  //   });
    it('tests Veteran reporting medical expenses path', () => {

  //     // cy.get('#root_claimantNotVeteranYes')
  //     //   .click();
  //     // cy.contains('button', 'Continue')
  //     //   .click()
  //     // fillInNameFromFixture(fixtureData.data.attributes.profile.first_name  +
  //     //   " " + fixtureData.data.attributes.profile.middle_name +
  //     //   " " + fixtureData.data.attributes.profile.last_name
  //     // );
  //     // fillInFullAddressFromFixutre(fixtureData.claimantAddress);
  //   });
    });

  
  describe('Veteran reporting medical expenses path', () => {
    before(() => {
      loginWithLocalStorage();
    });

    it('tests Veteran reporting medical expenses path', () => {
      cy.get('#root_claimantNotVeteranNoinput').click();
      cy.contains('button', 'Continue')
        .click();
      fillInNameFromFixture(fixtureData.veteranFullName);
      fillInFullAddressFromFixutre();

      // const contactData = {
      //   email : fixtureData.email,
      //   phone : fixtureData.primaryPhone.contact,
      // }
      fillInEmailAndPhoneFromFixture();

      const birthdate = fixtureData.data.attributes.profile.birth_date.split("-");
      const vetInfo = {
        ssn : "123-44-6789",
        fileNumber : "123456789",
        birthYear : birthdate[0],
        birthMonth : birthdate[1],
        birthDay : birthdate[2],
      }
      fillInVetInformationFromFixture(vetInfo);

      // const reportingFromDate = fixtureData.reportingPeriod.from.split("-");
      // const reportingToDate = fixtureData.reportingPeriod.to.split("-");
      // const reportingPeriodData = {
      //   fromYear : reportingFromDate[0],
      //   fromMonth : reportingFromDate[1],
      //   fromDay : reportingFromDate[2],
      //   toYear : reportingToDate[0],
      //   toMonth : reportingToDate[1],
      //   toDay : reportingToDate[2]
      // }
      //fillInReportingPeriodFromFixture();
      // cy.get('va-radio[name="root_hasCareExpenses"]')
      //   .shadow()
      //   .get('va-radio-option[value="Y"]')
      //   .get('input[type="radio"][value="Y"]')
      //   .click();
      cy.get('va-checkbox[data-key="hasCareExpenses"]')
        .shadow()
        .get('input[type="checkbox"]')
        .check();
      cy.contains('button', 'Continue')
        .click();

      fillInReportingPeriodFromFixture();
      // cy.contains('button', 'Continue')
      //   .click();

      
      //fillInCareExpensesFromFixture();
    });
  });

  // describe('Veteran reporting medical expenses path on foreign base', () => {
  //   before(() => {
  //     loginWithLocalStorage();
  //   });

  //   it('tests Veteran reporting medical expenses path', () => {
  //     cy.get('#root_claimantNotVeteranNoinput')
  //       .click();
  //     cy.contains('button', 'Continue')
  //       .click();
  //     fillInNameFromFixture(fixtureData.veteranFullName);
  //     fillInMilBaseAddressFromFixutre(fixtureData.claimantAddress);

  //   });
  // });
});
