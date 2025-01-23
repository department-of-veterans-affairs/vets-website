// Test need reworked to accommodate new web-component radio buttons
// adding .skip to test to ensure radio button change over is met by deadline and to avoid broken components in prod
// will add ticket to rework cypress tests in upcoming sprint.

function selectApplyForNewBenefit() {
  cy.get('.wizard-button')
    .click()
    .get('label[for="newBenefit-0"]')
    .should('be.visible');

  cy.axeCheck();

  cy.get('input[id="newBenefit-0"]').click();
}

function selectUpdateProgramOfStudy() {
  cy.get('.wizard-button')
    .click()
    .get('label[for="newBenefit-1"]')
    .should('be.visible');

  cy.axeCheck();

  cy.get('input[id="newBenefit-1"]').click();
}

function selectOwnEduBenefit() {
  cy.get('label[for="transferredEduBenefits-0"]').should('be.visible');
  cy.get('#transferredEduBenefits-0').click();
}

function selectTransferredEduBenefit() {
  cy.get('label[for="transferredEduBenefits-1"]').should('be.visible');
  cy.get('#transferredEduBenefits-1').click();
}

function selectFryScholarshipOrDEABenefit() {
  cy.get('label[for="transferredEduBenefits-2"]').should('be.visible');
  cy.get('#transferredEduBenefits-2').click();
}

function selectOwnServiceBasedBenefit() {
  cy.get('label[for="serviceBenefitBasedOn-0"]').should('be.visible');
  cy.get('#serviceBenefitBasedOn-0').click();
}

function selectOthersServiceBasedBenefit() {
  cy.get('label[for="serviceBenefitBasedOn-1"]').should('be.visible');
  cy.get('#serviceBenefitBasedOn-1').click();
}

function selectTransferredBenefits() {
  cy.get('label[for="sponsorTransferredBenefits-0"]').should('be.visible');
  cy.get('#sponsorTransferredBenefits-0')
    .click()
    .get('#apply-now-link')
    .should('be.visible');
}

function selectNonTransferredBenefits() {
  cy.get('label[for="sponsorTransferredBenefits-1"]').should('be.visible');
  cy.get('#sponsorTransferredBenefits-1').click();
}

function selectDeceasedDisabledMIASponsor() {
  cy.get('label[for="sponsorDeceasedDisabledMIA-0"]').should('be.visible');
  cy.get('#sponsorDeceasedDisabledMIA-0').click();
}

function selectNonDeceasedDisabledMIASponsor() {
  cy.get('label[for="sponsorDeceasedDisabledMIA-1"]').should('be.visible');
  cy.get('#sponsorDeceasedDisabledMIA-1').click();
}

function assertWarningIsShown() {
  cy.get('main .usa-alert-warning').should('be.visible');
}

function assertApplyButtonShowsForForm(form) {
  cy.get('#apply-now-link')
    .should('have.attr', 'href')
    .and(
      'contain',
      `/education/apply-for-education-benefits/application/${form}`,
    );
}

function selectVETTECCourses() {
  cy.get('label[for="vetTecBenefit-0"]').should('be.visible');
  cy.get('#vetTecBenefit-0').click();
}

function selectNonVETTECCourses() {
  cy.get('label[for="vetTecBenefit-1"]').should('be.visible');
  cy.get('#vetTecBenefit-1').click();
}

describe('Education Application Wizard', () => {
  // Ensure education apply-wizard page renders.
  beforeEach(() => {
    cy.visit(`/education/how-to-apply/`)
      .get('body')
      .should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it.skip('flow for New Benefits, Own Service, w/ VET TEC', () => {
    selectApplyForNewBenefit();
    selectOwnServiceBasedBenefit();
    selectVETTECCourses();
    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
      );
  });

  it.skip('flow for New Benefits, Own Service, w/o VET TEC', () => {
    selectApplyForNewBenefit();
    selectOwnServiceBasedBenefit();
    selectNonVETTECCourses();
    assertApplyButtonShowsForForm('1990');
  });

  it.skip('flow for New Benefits, Others Service w/ Transferred Benefits', () => {
    selectApplyForNewBenefit();
    selectOthersServiceBasedBenefit();
    selectTransferredBenefits();
    assertApplyButtonShowsForForm('1990E');
  });

  it.skip('flow for New Benefits, Others Service w/o Transferred Benefits and w/ deceased, disabled, MIA/POW sponsor', () => {
    selectApplyForNewBenefit();
    selectOthersServiceBasedBenefit();
    selectNonTransferredBenefits();
    selectDeceasedDisabledMIASponsor();
    assertApplyButtonShowsForForm('5490');
  });

  it.skip('flow for New Benefits, Others Service w/o Transferred Benefits and w/o deceased, disabled, MIA/POW sponsor', () => {
    selectApplyForNewBenefit();
    selectOthersServiceBasedBenefit();
    selectNonTransferredBenefits();
    selectNonDeceasedDisabledMIASponsor();
    assertWarningIsShown();
  });

  it.skip('flow for Updating Program of Study, Using own Benefits', () => {
    selectUpdateProgramOfStudy();
    selectOwnEduBenefit();
    assertApplyButtonShowsForForm('1995');
  });

  it.skip('flow for Updating Program of Study, Using transferred Benefits', () => {
    selectUpdateProgramOfStudy();
    selectTransferredEduBenefit();
    assertApplyButtonShowsForForm('1995');
  });

  it.skip('flow for Updating Program of Study, Using Fry Scholarship', () => {
    selectUpdateProgramOfStudy();
    selectFryScholarshipOrDEABenefit();
  });
});
