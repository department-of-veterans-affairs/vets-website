export const fillIdentityForm = testData => {
  cy.fill('[name="root_firstName"]', testData.veteranFullName.first);
  cy.fill('[name="root_lastName"]', testData.veteranFullName.last);
  cy.fillDate('root_dob', testData.veteranDateOfBirth);
  cy.fill('[name="root_ssn"]', testData.veteranSocialSecurityNumber);
  cy.findAllByText(/continue/i, { selector: 'button' })
    .first()
    .click();
  cy.wait(['@mockEnrollmentStatus']);
  cy.location('pathname').should('include', '/check-your-personal-information');
};

export const fillVeteranIncome = testData => {
  cy.fill(
    '[name="root_view:veteranGrossIncome_veteranGrossIncome"]',
    testData['view:veteranGrossIncome'].veteranGrossIncome,
  );
  cy.fill(
    '[name="root_view:veteranNetIncome_veteranNetIncome"]',
    testData['view:veteranNetIncome'].veteranNetIncome,
  );
  cy.fill(
    '[name="root_view:veteranOtherIncome_veteranOtherIncome"]',
    testData['view:veteranOtherIncome'].veteranOtherIncome,
  );
};

export const fillDependentBasicInformation = testData => {
  const {
    fullName,
    dateOfBirth,
    becameDependent,
    dependentRelation,
    socialSecurityNumber,
  } = testData;

  cy.fillName('root_fullName', fullName);
  cy.get('[name="root_dependentRelation"]').select(dependentRelation);
  cy.fill('[name="root_socialSecurityNumber"]', socialSecurityNumber);
  cy.fillDate('root_dateOfBirth', dateOfBirth);
  cy.fillDate('root_becameDependent', becameDependent);
};

export const fillDependentIncome = testData => {
  cy.fill(
    '[name="root_view:grossIncome_grossIncome"]',
    testData['view:grossIncome'].grossIncome,
  );
  cy.fill(
    '[name="root_view:netIncome_netIncome"]',
    testData['view:netIncome'].netIncome,
  );
  cy.fill(
    '[name="root_view:otherIncome_otherIncome"]',
    testData['view:otherIncome'].otherIncome,
  );
};

export const fillSpousalBasicInformation = testData => {
  const {
    spouseDateOfBirth,
    spouseFullName,
    spouseSocialSecurityNumber,
    dateOfMarriage,
  } = testData;

  cy.fillName('root_spouseFullName', spouseFullName);
  cy.fill(
    '[name="root_spouseSocialSecurityNumber"]',
    spouseSocialSecurityNumber,
  );
  cy.fillDate('root_spouseDateOfBirth', spouseDateOfBirth);
  cy.fillDate('root_dateOfMarriage', dateOfMarriage);
};

export const fillSpousalIncome = testData => {
  cy.fill(
    '[name="root_view:spouseGrossIncome_spouseGrossIncome"]',
    testData['view:spouseIncome'].spouseGrossIncome,
  );
  cy.fill(
    '[name="root_view:spouseNetIncome_spouseNetIncome"]',
    testData['view:spouseIncome'].spouseNetIncome,
  );
  cy.fill(
    '[name="root_view:spouseOtherIncome_spouseOtherIncome"]',
    testData['view:spouseIncome'].spouseOtherIncome,
  );
};

export const fillDeductibleExpenses = testData => {
  cy.fill(
    '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    testData['view:deductibleMedicalExpenses'].deductibleMedicalExpenses,
  );
  cy.fill(
    '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    testData['view:deductibleEducationExpenses'].deductibleEducationExpenses,
  );
  cy.fill(
    '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    testData['view:deductibleFuneralExpenses'].deductibleFuneralExpenses,
  );
};

export const fillVaFacility = testData => {
  const { vaMedicalFacility, 'view:facilityState': facilityState } = testData;
  cy.selectVaSelect(
    'root_view:preferredFacility_view:facilityState',
    facilityState,
  );
  cy.wait('@getFacilities');
  cy.selectVaSelect(
    'root_view:preferredFacility_vaMedicalFacility',
    vaMedicalFacility,
  );
};
