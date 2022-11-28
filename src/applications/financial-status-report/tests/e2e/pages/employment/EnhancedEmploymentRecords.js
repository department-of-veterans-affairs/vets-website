class EnhancedEmploymentRecords {
  employerFill = employer => {
    cy.findByLabelText(/Type of work/).select(employer.type);
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
    cy.get(`input[name="employerName"]`).type(employer.employerName);
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  };

  failValidationEmployerFill = employer => {
    cy.findByLabelText(/Type of work/).select(employer.type);
    cy.findByLabelText(/Type of work/).select('');
    cy.get('#errorable-select-1-error-message').should('exist');
    cy.findByLabelText(/Type of work/).select(employer.type);
    cy.get('#errorable-select-1-error-message').should('not.exist');

    cy.fillDate('from', `2300-1`);
    cy.get(':nth-child(2) > .hydrated')
      .shadow()
      .find('#error-message')
      .should('exist')
      .should('contain', 'start date.');

    if (employer.isCurrent) {
      cy.get(`input[name="current-employment"]`).check();

      cy.get(':nth-child(2) > .hydrated')
        .shadow()
        .find('#error-message')
        .should('exist')
        .should('contain', '1900');

      // Not overwriting values?
      cy.fillDate(
        'from',
        `${employer.from.split('-')[0]}-${employer.from.split('-')[1]}`,
      );
    } else {
      cy.fillDate(
        'to',
        `${employer.to.split('-')[0]}-${employer.to.split('-')[1]}`,
      );
    }

    cy.get(`input[name="employerName"]`).type(employer.employerName);
    cy.get(`input[name="employerName"]`).clear();
    cy.get('#errorable-text-input-1-error-message')
      .should('exist')
      .should('contain', 'employer name');
    cy.get(`input[name="employerName"]`).type(employer.employerName);
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  };

  addEmployer = () => {
    cy.get('.add-item-button').click();
  };
}

export default new EnhancedEmploymentRecords();
