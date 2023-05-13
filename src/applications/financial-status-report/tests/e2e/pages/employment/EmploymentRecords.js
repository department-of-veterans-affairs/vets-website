class EmploymentRecords {
  employerFill = employer => {
    cy.get('#type')
      .shadow()
      .find('select')
      .select(employer.type);
    cy.fillDate(
      'from',
      `${employer.from.split('-')[0]}-${employer.from.split('-')[1]}`,
    );
    if (employer.isCurrent) {
      cy.get(`input[name="current-employment"]`).check();
    } else {
      cy.fillDate(
        'to',
        `${employer.to.split('-')[0]}-${employer.to.split('-')[1]}`,
      );
    }
    cy.get('#employer-name')
      .shadow()
      .find('input')
      .type(employer.employerName);
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  };

  addEmployer = () => {
    cy.get('.add-item-button').click();
  };
}

export default new EmploymentRecords();
