import maxTestData from './fixtures/data/maximal-test.json';
import {
  acceptPrivacyAgreement,
  advanceFromHouseholdToReview,
  advanceToHousehold,
  fillDependentBasicInformation,
  fillSpousalBasicInformation,
  goToNextPage,
  setupForAuth,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Non-disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works without sharing household information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('N');

    goToNextPage('/household-information/share-financial-information-confirm');
    cy.findByText(
      /confirm that you don\u2019t want to provide your household financial information/i,
    )
      .first()
      .should('exist');
    cy.findAllByText(/confirm/i, { selector: 'button' })
      .first()
      .click();

    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.false');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works without spouse or dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[type="radio"]')
      .last()
      .check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-Household: Spousal disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works with spouse who lived with Veteran', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation();

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_sameAddress"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[type="radio"]')
      .last()
      .check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/spouse-annual-income');
    cy.get('[name="root_view:spouseGrossIncome_spouseGrossIncome"]').type(
      testData['view:spouseIncome'].spouseGrossIncome,
    );
    cy.get('[name="root_view:spouseNetIncome_spouseNetIncome"]').type(
      testData['view:spouseIncome'].spouseNetIncome,
    );
    cy.get('[name="root_view:spouseOtherIncome_spouseOtherIncome"]').type(
      testData['view:spouseIncome'].spouseOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with spouse who did not live with Veteran', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation();

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_sameAddress"]').check('N');

    goToNextPage('/household-information/spouse-financial-support');
    cy.get('[name="root_provideSupportLastYear"]').check('N');

    goToNextPage('/household-information/spouse-contact-information');
    cy.get('#root_spouseAddress_street').type(
      testData['view:spouseContactInformation'].spouseAddress.street,
    );
    cy.get('#root_spouseAddress_city').type(
      testData['view:spouseContactInformation'].spouseAddress.city,
    );
    cy.get('#root_spouseAddress_state').select(
      testData['view:spouseContactInformation'].spouseAddress.state,
    );
    cy.get('#root_spouseAddress_postalCode').type(
      testData['view:spouseContactInformation'].spouseAddress.postalCode,
    );
    cy.get('#root_spousePhone').type(
      testData['view:spouseContactInformation'].spousePhone,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[type="radio"]')
      .last()
      .check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/spouse-annual-income');
    cy.get('[name="root_view:spouseGrossIncome_spouseGrossIncome"]').type(
      testData['view:spouseIncome'].spouseGrossIncome,
    );
    cy.get('[name="root_view:spouseNetIncome_spouseNetIncome"]').type(
      testData['view:spouseIncome'].spouseNetIncome,
    );
    cy.get('[name="root_view:spouseOtherIncome_spouseOtherIncome"]').type(
      testData['view:spouseIncome'].spouseOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-Household: Dependent disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works with dependent who is of college age, lived with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(22500);
    cy.get('[name="root_view:netIncome_netIncome"]').type(17100);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(0);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.get('#root_dependentEducationExpenses').type(
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(22500);
    cy.get('[name="root_view:netIncome_netIncome"]').type(17100);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(0);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.get('#root_dependentEducationExpenses').type(
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(22500);
    cy.get('[name="root_view:netIncome_netIncome"]').type(17100);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(0);

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(22500);
    cy.get('[name="root_view:netIncome_netIncome"]').type(17100);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(0);

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('HCA-Household: Full disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works with full spousal and dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Married');

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation();

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_sameAddress"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(22500);
    cy.get('[name="root_view:netIncome_netIncome"]').type(17100);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(0);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.get('#root_dependentEducationExpenses').type(
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
      testData.veteranGrossIncome,
    );
    cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
      testData.veteranNetIncome,
    );
    cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
      testData.veteranOtherIncome,
    );

    goToNextPage('/household-information/spouse-annual-income');
    cy.get('[name="root_view:spouseGrossIncome_spouseGrossIncome"]').type(
      testData['view:spouseIncome'].spouseGrossIncome,
    );
    cy.get('[name="root_view:spouseNetIncome_spouseNetIncome"]').type(
      testData['view:spouseIncome'].spouseNetIncome,
    );
    cy.get('[name="root_view:spouseOtherIncome_spouseOtherIncome"]').type(
      testData['view:spouseIncome'].spouseOtherIncome,
    );

    goToNextPage('/household-information/deductible-expenses');
    cy.get(
      '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    ).type(testData.deductibleMedicalExpenses);
    cy.get(
      '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    ).type(testData.deductibleEducationExpenses);
    cy.get(
      '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    ).type(testData.deductibleFuneralExpenses);

    advanceFromHouseholdToReview();

    // accept the privacy agreement
    acceptPrivacyAgreement();

    // submit form
    cy.findByText(/submit/i, { selector: 'button' }).click();

    // check for correct disclosure value
    cy.wait('@mockSubmit').then(interception => {
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('discloseFinancialInformation')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');

    cy.injectAxe();
    cy.axeCheck();
  });
});
