describe('HCA', () => {
  beforeEach(() => {
    // Grab test data
    cy.fixture('hca/maximal-test.json').as('testData');
  });

  it('renders the introduction page', () => {
    cy.visit('http://localhost:3001/health-care/apply/application');

    cy.get('.schemaform-start-button')
      .first()
      .click();
  });

  it('fills out the personal information section', () => {
    cy.get('@testData').then(testData => {
      cy.get('#root_firstName').type(testData.veteranFullName.first);
      cy.get('#root_lastName').type(testData.veteranFullName.last);
      cy.fillDate('root_dob', testData.veteranDateOfBirth);
      cy.get('#root_ssn').type(testData.veteranSocialSecurityNumber);
      // Click 'Continue to the Application' button
      cy.get('.usa-button').click();

      cy.get('#root_veteranFullName_first').should(
        'have.value',
        testData.veteranFullName.first,
      );
      cy.get('#root_veteranFullName_last').should(
        'have.value',
        testData.veteranFullName.last,
      );
      cy.get('#root_veteranFullName_middle').type(
        testData.veteranFullName.middle,
      );
      cy.get('#root_veteranFullName_suffix')
        .select(testData.veteranFullName.suffix)
        .should('have.value', testData.veteranFullName.suffix);
      cy.get('#root_mothersMaidenName').type(testData.mothersMaidenName);
      cy.get('.form-panel .usa-button-primary').click();

      // Date of Birth Page
      const [
        vetDobYear,
        vetDobMonth,
        vetDobDay,
      ] = testData.veteranDateOfBirth.split('-');
      cy.get('#root_veteranDateOfBirthMonth').should(
        'have.value',
        `${parseInt(vetDobMonth, 10)}`,
      );
      cy.get('#root_veteranDateOfBirthDay').should(
        'have.value',
        `${parseInt(vetDobDay, 10)}`,
      );
      cy.get('#root_veteranDateOfBirthYear').should(
        'have.value',
        `${parseInt(vetDobYear, 10)}`,
      );
      cy.get('#root_veteranSocialSecurityNumber').should(
        'have.value',
        testData.veteranSocialSecurityNumber,
      );
      cy.get('.schemaform-field-container .schemaform-block').within(() => {
        cy.get('input').type(testData['view:placeOfBirth'].cityOfBirth);
        cy.get('select')
          .select(testData['view:placeOfBirth'].stateOfBirth)
          .should('have.value', testData['view:placeOfBirth'].stateOfBirth);
      });
      cy.get('.form-panel .usa-button-primary').click();

      // Demographics Page
      cy.get('#root_gender')
        .select(testData.gender)
        .should('have.value', testData.gender);
      cy.get('#root_maritalStatus')
        .select(testData.maritalStatus)
        .should('have.value', testData.maritalStatus);
      cy.get('[type="checkbox"]').each($checkbox => {
        // use cypress commands on it
        cy.wrap($checkbox).click();
      });
      cy.get('.form-panel .usa-button-primary').click();

      // Permanent Address Page
      cy.get('#root_veteranAddress_country').should(
        'have.value',
        testData.veteranAddress.country,
      );
      cy.get('#root_veteranAddress_street').type(
        testData.veteranAddress.street,
      );
      cy.get('#root_veteranAddress_street2').type(
        testData.veteranAddress.street2,
      );
      cy.get('#root_veteranAddress_street3').type(
        testData.veteranAddress.street3,
      );
      cy.get('#root_veteranAddress_city').type(testData.veteranAddress.city);
      cy.get('#root_veteranAddress_state')
        .select(testData.veteranAddress.state)
        .should('have.value', testData.veteranAddress.state);
      cy.get('#root_veteranAddress_postalCode').type(
        testData.veteranAddress.postalCode,
      );
      cy.get('.form-panel .usa-button-primary').click();

      // Contact Information Page
      cy.get('[type="email"]').each($input => {
        cy.wrap($input).type(testData.email);
      });
      cy.get('#root_homePhone').type(testData.homePhone);
      cy.get('#root_mobilePhone').type(testData.mobilePhone);
      cy.get('.form-panel .usa-button-primary').click();
    });
  });

  it('fills out the military service section', () => {
    cy.get('@testData').then(testData => {
      cy.get('#root_lastServiceBranch')
        .select(testData.lastServiceBranch)
        .should('have.value', testData.lastServiceBranch);
      cy.fillDate('root_lastEntryDate', testData.lastEntryDate);
      cy.fillDate('root_lastDischargeDate', testData.lastDischargeDate);
      cy.get('#root_dischargeType')
        .select(testData.dischargeType)
        .should('have.value', testData.dischargeType);
      cy.get('.form-panel .usa-button-primary').click();

      // Service History Page
      cy.get('[type="checkbox"]').each($checkbox => {
        // use cypress commands on it
        cy.wrap($checkbox).click();
      });
      cy.get('.form-panel .usa-button-primary').click();

      // Upload Discharge Papers
      // TODO
      cy.get('.form-panel .usa-button-primary').click();
    });
  });

  it('fills out the VA benefits section', () => {
    cy.get('@testData').then(testData => {
      // Current compensation
      cy.get('[type="radio"]').check(testData.vaCompensationType);
      cy.get('.form-panel .usa-button-primary').click();
    });
  });

  it('fills out the household information section', () => {
    cy.get('@testData').then(testData => {
      // Current compensation
      cy.get('#root_discloseFinancialInformationYes').click();
      cy.get('.form-panel .usa-button-primary').click();

      // Spouses Information
      cy.get('#root_spouseFullName_first').type(testData.spouseFullName.first);
      cy.get('#root_spouseFullName_middle').type(
        testData.spouseFullName.middle,
      );
      cy.get('#root_spouseFullName_last').type(testData.spouseFullName.last);
      cy.get('#root_spouseFullName_suffix').select(
        testData.spouseFullName.suffix,
      );
      cy.get('#root_spouseSocialSecurityNumber').type(
        testData.spouseSocialSecurityNumber,
      );
      cy.fillDate('root_spouseDateOfBirth', testData.spouseDateOfBirth);
      cy.fillDate('root_dateOfMarriage', testData.dateOfMarriage);
      cy.get('#root_sameAddressNo').click();
      // Spouse address & telephone number
      cy.get('.schemaform-field-container .schemaform-block').within(() => {
        cy.get('select').should(
          'have.value',
          testData['view:spouseContactInformation'].spouseAddress.country,
        );
        // Street
        cy.get('input')
          .eq(0)
          .type(testData['view:spouseContactInformation'].spouseAddress.street);
        // Line 2
        cy.get('input')
          .eq(1)
          .type(
            testData['view:spouseContactInformation'].spouseAddress.street2,
          );
        // Line 3
        cy.get('input')
          .eq(2)
          .type(
            testData['view:spouseContactInformation'].spouseAddress.street3,
          );
        // City
        cy.get('input')
          .eq(3)
          .type(testData['view:spouseContactInformation'].spouseAddress.city);
        // State
        cy.get('select')
          .eq(1)
          .select(
            testData['view:spouseContactInformation'].spouseAddress.state,
          );
        // Postal code
        cy.get('input')
          .eq(4)
          .type(
            testData['view:spouseContactInformation'].spouseAddress.postalCode,
          );
        // Phone
        cy.get('input')
          .eq(5)
          .type(testData['view:spouseContactInformation'].spousePhone);
      });
      cy.get('.form-panel .usa-button-primary').click();
      cy.get('[type="radio"]').check('Y');
      cy.get('.form-panel .usa-button-primary').click();
      cy.get('#root_dependents_0_fullName_first').type(
        testData.dependents[0].fullName.first,
      );
      cy.get('#root_dependents_0_fullName_middle').type(
        testData.dependents[0].fullName.middle,
      );
      cy.get('#root_dependents_0_fullName_last').type(
        testData.dependents[0].fullName.last,
      );
      cy.get('#root_dependents_0_fullName_suffix')
        .select(testData.dependents[0].fullName.suffix)
        .should('have.value', testData.dependents[0].fullName.suffix);
      cy.get('#root_dependents_0_dependentRelation')
        .select(testData.dependents[0].dependentRelation)
        .should('have.value', testData.dependents[0].dependentRelation);
      cy.get('#root_dependents_0_socialSecurityNumber').type(
        testData.dependents[0].socialSecurityNumber,
      );
      cy.fillDate(
        'root_dependents_0_dateOfBirth',
        testData.dependents[0].dateOfBirth,
      );
      cy.fillDate(
        'root_dependents_0_becameDependent',
        testData.dependents[0].becameDependent,
      );
      cy.get('#root_dependents_0_disabledBefore18Yes').click();
      cy.get('#root_dependents_0_attendedSchoolLastYearYes').click();
      cy.get('#root_dependents_0_dependentEducationExpenses').type(
        testData.dependents[0].dependentEducationExpenses,
      );
      cy.get('#root_dependents_0_cohabitedLastYearNo').click();
      cy.get('#root_dependents_0_receivedSupportLastYearYes').click();
      cy.get('.form-panel .usa-button-primary').click();

      // Annual income
      cy.get('#root_veteranGrossIncome').type(testData.veteranGrossIncome);
      cy.get('#root_veteranNetIncome').type(testData.veteranNetIncome);
      cy.get('#root_veteranOtherIncome').type(testData.veteranOtherIncome);
      // Spouse gross income
      cy.get('input')
        .eq(4)
        .type(testData['view:spouseIncome'].spouseGrossIncome);
      // Spouse net income from business
      cy.get('input')
        .eq(5)
        .type(testData['view:spouseIncome'].spouseNetIncome);
      // Spouse other income from business
      cy.get('input')
        .eq(6)
        .type(testData['view:spouseIncome'].spouseOtherIncome);
      // Dependent income
      cy.get('input')
        .eq(7)
        .type(testData.dependents[0].grossIncome);
      cy.get('input')
        .eq(8)
        .type(testData.dependents[0].netIncome);
      cy.get('input')
        .eq(9)
        .type(testData.dependents[0].otherIncome);
      cy.get('.form-panel .usa-button-primary').click();

      // Previous year's deductible expenses
      cy.get('#root_deductibleMedicalExpenses').type(
        testData.deductibleMedicalExpenses,
      );
      cy.get('#root_deductibleFuneralExpenses').type(
        testData.deductibleFuneralExpenses,
      );
      cy.get('#root_deductibleEducationExpenses').type(
        testData.deductibleEducationExpenses,
      );
      cy.get('.form-panel .usa-button-primary').click();
    });
  });

  it('fills out the insurance information section', () => {
    cy.get('@testData').then(testData => {
      // Insurance information
      cy.get('#root_isMedicaidEligibleYes').click();
      cy.get('#root_isEnrolledMedicarePartAYes').click();
      cy.fillDate(
        'root_medicarePartAEffectiveDate',
        testData.medicarePartAEffectiveDate,
      );
      cy.get('.form-panel .usa-button-primary').click();

      // Other Coverage
      cy.get('#root_isCoveredByHealthInsuranceYes').click();
      cy.get('#root_providers_0_insuranceName').type(
        testData.providers[0].insuranceName,
      );
      cy.get('#root_providers_0_insurancePolicyHolderName').type(
        testData.providers[0].insurancePolicyHolderName,
      );
      cy.get('#root_providers_0_insurancePolicyNumber').type(
        testData.providers[0].insurancePolicyNumber,
      );
      cy.get('#root_providers_0_insuranceGroupCode').type(
        testData.providers[0].insuranceGroupCode,
      );
      cy.get('.form-panel .usa-button-primary').click();

      // VA facility
      cy.get('#root_isEssentialAcaCoverage').click();
      // State
      cy.get('select')
        .eq(0)
        .select(testData['view:preferredFacility']['view:facilityState']);
      // Center or Clinic
      cy.get('select')
        .eq(1)
        .select(testData['view:preferredFacility'].vaMedicalFacility);
      cy.get('#root_wantsInitialVaContactYes').click();
      cy.get('.form-panel .usa-button-primary').click();
    });
  });

  it('submits the application', () => {
    cy.get('[type="checkbox"]').click();
    cy.findByText('Submit application')
      .should('exist')
      .click();
    cy.contains('Thank you for submitting your application').should(
      'be.visible',
    );
  });
});
