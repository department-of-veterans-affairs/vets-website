class EmplymentRecords {
  employerFill = employer => {
    cy.findByLabelText(/Type of work/).select(employer.type);
    cy.get(`select[name="fromMonth"]`).select(employer.from.split('-')[1]);
    cy.get(`input[name="fromYear"]`).type(employer.from.split('-')[0]);
    if (employer.isCurrent) {
      cy.get(`input[name="current-employment"]`).check();
    } else {
      cy.get(`select[name="toMonth"]`).select(employer.to.split('-')[1]);
      cy.get(`input[name="toYear"]`).type(employer.to.split('-')[0]);
    }
    cy.get(`input[name="employerName"]`).type(employer.employerName);
    cy.findAllByText(/Save/i, { selector: 'button' })
      .first()
      .click();
  };

  addEmployer = () => {
    cy.get('.add-item-button').click();
  };
}

export default new EmplymentRecords();
