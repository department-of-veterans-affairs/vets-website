import { terminalLog } from '../../../platform/testing/e2e-cypress/helpers.js';

describe('HCA form', () => {
  before(() => {
    // Grab test data
    cy.fixture('hca/maximal-test.json').as('testData');

    cy.server();

    cy.route({
      method: 'GET',
      url: '/v0/health_care_applications/enrollment_status*',
      status: 404,
      response: {
        errors: [
          {
            title: 'Record not found',
            detail: 'The record identified by  could not be found',
            code: '404',
            status: '404',
          },
        ],
      },
    }).as('getApplication');

    cy.route('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    }).as('submitApplication');

    // Workaround to intercept requests made with fetch API.
    cy.on('window:before:load', window => {
      // eslint-disable-next-line no-param-reassign
      delete window.fetch;
    });
  });

  it('submits a valid application', () => {
    // Start the application
    cy.visit('health-care/apply/application')
      .get('.schemaform-start-button')
      .first()
      .click()
      .injectAxe();

    // Ignore 'heading-order' axe error for now
    cy.configureAxe({
      rules: [
        {
          id: 'heading-order',
          enabled: false,
        },
      ],
    });

    // Fill the application
    cy.get('@testData').then(testData => {
      // Fill out the personal information section
      cy.log('fill out the personal information section');

      // ID Form page
      cy.get('#root_firstName')
        .type(testData.veteranFullName.first)
        .get('#root_lastName')
        .type(testData.veteranFullName.last)
        .fillDate('root_dob', testData.veteranDateOfBirth)
        .get('#root_ssn')
        .type(testData.veteranSocialSecurityNumber)
        .checkA11y('.main', null, terminalLog)
        .get('.usa-button')
        .click()
        .wait('@getApplication');

      // Personal information page
      cy.get('#root_veteranFullName_first')
        .should('have.value', testData.veteranFullName.first)
        .get('#root_veteranFullName_last')
        .should('have.value', testData.veteranFullName.last)
        .get('#root_veteranFullName_middle')
        .type(testData.veteranFullName.middle)
        .get('#root_veteranFullName_suffix')
        .select(testData.veteranFullName.suffix)
        .should('have.value', testData.veteranFullName.suffix)
        .get('#root_mothersMaidenName')
        .type(testData.mothersMaidenName)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Birth information page
      const [
        vetDobYear,
        vetDobMonth,
        vetDobDay,
      ] = testData.veteranDateOfBirth.split('-');

      cy.get('#root_veteranDateOfBirthMonth')
        .should('have.value', `${parseInt(vetDobMonth, 10)}`)
        .get('#root_veteranDateOfBirthDay')
        .should('have.value', `${parseInt(vetDobDay, 10)}`)
        .get('#root_veteranDateOfBirthYear')
        .should('have.value', `${parseInt(vetDobYear, 10)}`)
        .get('#root_veteranSocialSecurityNumber')
        .should('have.value', testData.veteranSocialSecurityNumber)
        .get('.schemaform-field-container .schemaform-block')
        .within(() => {
          cy.get('input')
            .type(testData['view:placeOfBirth'].cityOfBirth)
            .get('select')
            .select(testData['view:placeOfBirth'].stateOfBirth)
            .should('have.value', testData['view:placeOfBirth'].stateOfBirth);
        })
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Demographics information Page
      cy.get('#root_gender')
        .select(testData.gender)
        .should('have.value', testData.gender)
        .get('#root_maritalStatus')
        .select(testData.maritalStatus)
        .should('have.value', testData.maritalStatus)
        .get('[type="checkbox"]')
        .each($checkbox => {
          // use cypress commands on it
          cy.wrap($checkbox).click();
        })
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Veteran address Page
      cy.get('#root_veteranAddress_country')
        .should('have.value', testData.veteranAddress.country)
        .get('#root_veteranAddress_street')
        .type(testData.veteranAddress.street)
        .get('#root_veteranAddress_street2')
        .type(testData.veteranAddress.street2)
        .get('#root_veteranAddress_street3')
        .type(testData.veteranAddress.street3)
        .get('#root_veteranAddress_city')
        .type(testData.veteranAddress.city)
        .get('#root_veteranAddress_state')
        .select(testData.veteranAddress.state)
        .should('have.value', testData.veteranAddress.state)
        .get('#root_veteranAddress_postalCode')
        .type(testData.veteranAddress.postalCode)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Contact information Page
      cy.get('[type="email"]')
        .each($input => {
          cy.wrap($input).type(testData.email);
        })
        .get('#root_homePhone')
        .type(testData.homePhone)
        .get('#root_mobilePhone')
        .type(testData.mobilePhone)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Military service page
      cy.get('#root_lastServiceBranch')
        .select(testData.lastServiceBranch)
        .should('have.value', testData.lastServiceBranch)
        .fillDate('root_lastEntryDate', testData.lastEntryDate)
        .fillDate('root_lastDischargeDate', testData.lastDischargeDate)
        .get('#root_dischargeType')
        .select(testData.dischargeType)
        .should('have.value', testData.dischargeType)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Military service additional information page
      cy.get('[type="checkbox"]')
        .each($checkbox => {
          // use cypress commands on it
          cy.wrap($checkbox).click();
        })
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Military service documents page
      // TODO
      cy.get('[type=file]')
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Financial disclosure page
      cy.get('[type="radio"]')
        .check(testData.vaCompensationType)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click()
        .get('#root_discloseFinancialInformationYes')
        .click()
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Spouses information page
      cy.get('#root_spouseFullName_first')
        .type(testData.spouseFullName.first)
        .get('#root_spouseFullName_middle')
        .type(testData.spouseFullName.middle)
        .get('#root_spouseFullName_last')
        .type(testData.spouseFullName.last)
        .get('#root_spouseFullName_suffix')
        .select(testData.spouseFullName.suffix)
        .get('#root_spouseSocialSecurityNumber')
        .type(testData.spouseSocialSecurityNumber)
        .fillDate('root_spouseDateOfBirth', testData.spouseDateOfBirth)
        .fillDate('root_dateOfMarriage', testData.dateOfMarriage)
        .get('#root_sameAddressNo')
        .click()
        // Spouse address & telephone number
        .get('.schemaform-field-container .schemaform-block')
        .within(() => {
          cy.get('select')
            .should(
              'have.value',
              testData['view:spouseContactInformation'].spouseAddress.country,
            )
            // Street
            .get('input')
            .eq(0)
            .type(
              testData['view:spouseContactInformation'].spouseAddress.street,
            )
            // Line 2
            .get('input')
            .eq(1)
            .type(
              testData['view:spouseContactInformation'].spouseAddress.street2,
            )
            // Line 3
            .get('input')
            .eq(2)
            .type(
              testData['view:spouseContactInformation'].spouseAddress.street3,
            )
            // City
            .get('input')
            .eq(3)
            .type(testData['view:spouseContactInformation'].spouseAddress.city)
            // State
            .get('select')
            .eq(1)
            .select(
              testData['view:spouseContactInformation'].spouseAddress.state,
            )
            // Postal code
            .get('input')
            .eq(4)
            .type(
              testData['view:spouseContactInformation'].spouseAddress
                .postalCode,
            )
            // Phone
            .get('input')
            .eq(5)
            .type(testData['view:spouseContactInformation'].spousePhone);
        })
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Dependent information page
      cy.get('[type="radio"]')
        .check('Y')
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click()
        .get('#root_dependents_0_fullName_first')
        .type(testData.dependents[0].fullName.first)
        .get('#root_dependents_0_fullName_middle')
        .type(testData.dependents[0].fullName.middle)
        .get('#root_dependents_0_fullName_last')
        .type(testData.dependents[0].fullName.last)
        .get('#root_dependents_0_fullName_suffix')
        .select(testData.dependents[0].fullName.suffix)
        .should('have.value', testData.dependents[0].fullName.suffix)
        .get('#root_dependents_0_dependentRelation')
        .select(testData.dependents[0].dependentRelation)
        .should('have.value', testData.dependents[0].dependentRelation)
        .get('#root_dependents_0_socialSecurityNumber')
        .type(testData.dependents[0].socialSecurityNumber)
        .fillDate(
          'root_dependents_0_dateOfBirth',
          testData.dependents[0].dateOfBirth,
        )
        .fillDate(
          'root_dependents_0_becameDependent',
          testData.dependents[0].becameDependent,
        )
        .get('#root_dependents_0_disabledBefore18Yes')
        .click()
        .get('#root_dependents_0_attendedSchoolLastYearYes')
        .click()
        .get('#root_dependents_0_dependentEducationExpenses')
        .type(testData.dependents[0].dependentEducationExpenses)
        .get('#root_dependents_0_cohabitedLastYearNo')
        .click()
        .get('#root_dependents_0_receivedSupportLastYearYes')
        .click()
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Annual income page
      cy.get('#root_veteranGrossIncome')
        .type(testData.veteranGrossIncome)
        .get('#root_veteranNetIncome')
        .type(testData.veteranNetIncome)
        .get('#root_veteranOtherIncome')
        .type(testData.veteranOtherIncome)
        // Spouse gross income
        .get('input')
        .eq(4)
        .type(testData['view:spouseIncome'].spouseGrossIncome)
        // Spouse net income from business
        .get('input')
        .eq(5)
        .type(testData['view:spouseIncome'].spouseNetIncome)
        // Spouse other income from business
        .get('input')
        .eq(6)
        .type(testData['view:spouseIncome'].spouseOtherIncome)
        // Dependent income
        .get('input')
        .eq(7)
        .type(testData.dependents[0].grossIncome)
        .get('input')
        .eq(8)
        .type(testData.dependents[0].netIncome)
        .get('input')
        .eq(9)
        .type(testData.dependents[0].otherIncome)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Deductible expenses page
      cy.get('#root_deductibleMedicalExpenses')
        .type(testData.deductibleMedicalExpenses)
        .get('#root_deductibleFuneralExpenses')
        .type(testData.deductibleFuneralExpenses)
        .get('#root_deductibleEducationExpenses')
        .type(testData.deductibleEducationExpenses)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Insurance information page
      cy.get('#root_isMedicaidEligibleYes')
        .click()
        .get('#root_isEnrolledMedicarePartAYes')
        .click()
        .fillDate(
          'root_medicarePartAEffectiveDate',
          testData.medicarePartAEffectiveDate,
        )
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // Other Coverage page
      cy.get('#root_isCoveredByHealthInsuranceYes')
        .click()
        .get('#root_providers_0_insuranceName')
        .type(testData.providers[0].insuranceName)
        .get('#root_providers_0_insurancePolicyHolderName')
        .type(testData.providers[0].insurancePolicyHolderName)
        .get('#root_providers_0_insurancePolicyNumber')
        .type(testData.providers[0].insurancePolicyNumber)
        .get('#root_providers_0_insuranceGroupCode')
        .type(testData.providers[0].insuranceGroupCode)
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();

      // VA facility page
      cy.get('#root_isEssentialAcaCoverage')
        .click()
        // State
        .get('select')
        .eq(0)
        .select(testData['view:preferredFacility']['view:facilityState'])
        // Center or Clinic
        .get('select')
        .eq(1)
        .select(testData['view:preferredFacility'].vaMedicalFacility)
        .get('#root_wantsInitialVaContactYes')
        .click()
        .checkA11y('.main', null, terminalLog)
        .get('.form-panel .usa-button-primary')
        .click();
    });

    // Review and Submit Page
    cy.get('[type="checkbox"]')
      .click()
      .checkA11y('.main', null, terminalLog)
      .get('.main')
      .contains('Submit application')
      .click()
      .wait('@submitApplication')
      .get('.main')
      .contains('Thank you for submitting your application')
      .should('be.visible')
      .checkA11y('.main', null, terminalLog);
  });
});
