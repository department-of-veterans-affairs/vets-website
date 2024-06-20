import { customButtonGroupContinue } from '../fixtures/helpers';

const fillEmploymentInformation = employer => {
  // enhanced-employment-records
  // enhanced-spouse-employment-records
  cy.get('#type')
    .shadow()
    .find('select')
    .select(employer.type);
  cy.get('#employer-name')
    .shadow()
    .find('input')
    .type(employer.employerName);

  // Current includes gmi, and deductions
  if (employer.isCurrent) {
    // enhanced-employment-records
    cy.get(`va-radio-option[value="true"]`).click();
    customButtonGroupContinue();

    // employment-work-dates
    // spouse-employment-work-dates
    cy.fillVaDate('from', employer.from, true);
    customButtonGroupContinue();

    // gross-monthly-income
    // spouse-gross-monthly-income
    cy.get('[data-testid="gross-monthly-income"]')
      .shadow()
      .find('input')
      .type(employer.grossMonthlyIncome);
    cy.get('.usa-button-primary').click();

    // deduction-checklist
    // spouse-deduction-checklist
    employer.deductions.forEach(deduction => {
      cy.get(`va-checkbox[name="${deduction.name}"]`)
        .shadow()
        .find('input')
        .check({ force: true });
    });
    cy.get('.usa-button-primary').click();

    // deduction-values
    // spouse-deduction-values
    cy.get('va-number-input')
      .as('InputList')
      .should('have.length', employer.deductions.length);
    cy.get('@InputList').each((input, index) => {
      cy.wrap(input)
        .find('label')
        .should('contain', employer.deductions[index].name);
      cy.wrap(input)
        .find('input')
        .type(employer.deductions[index].amount);
    });
    customButtonGroupContinue();
  } else {
    // enhanced-employment-records
    // enhanced-spouse-employment-records
    cy.get(`va-radio-option[value="false"]`).click();
    customButtonGroupContinue();

    // employment-work-dates
    // spouse-employment-work-dates
    cy.fillVaDate('from', employer.from, true);
    cy.fillVaDate('to', employer.to, true);
    customButtonGroupContinue('Add employment record');
  }
};

const employmentInformationLoop = employers => {
  // page flow is same for veteran and spouse
  // const employers =
  //   veteranOrSpouse === 'veteran'
  //     ? employmentHistory.veteran.employmentRecords
  //     : employmentHistory.spouse.spEmploymentRecords;

  // loop through employers and add them to the form
  for (let i = 0; i < employers.length; i++) {
    fillEmploymentInformation(employers[i]);
    cy.get('[data-testid="mini-summary-card"]').should('have.length', i + 1);

    // use link to add new employer if there are any left
    if (i < employers.length - 1) {
      cy.get('.vads-c-action-link--green').click();
    }
  }
  cy.get('va-card')
    .as('EmploymentCards')
    .should('have.length', employers.length);

  // verify that the cards were added in the correct order with the correct name
  // Most recently added card is on top
  for (let i = employers.length - 1; i >= 0; i--) {
    cy.get('[data-testid="mini-summary-card-header"]')
      .eq(i - 1)
      .should('contain', employers[i].employerName);
  }
};

export { employmentInformationLoop };
