class EnhancedEmploymentRecords {
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
      cy.get(`va-checkbox[name="current-employment"]`)
        .shadow()
        .find('input')
        .check();
    } else {
      cy.fillDate(
        'to',
        `${employer.to.split('-')[0]}-${employer.to.split('-')[1]}`,
      );
    }
    cy.get(`[label="Employer name"]`)
      .shadow()
      .find('input')
      .type(employer.employerName);
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  };

  failValidationEmployerFill = employer => {
    cy.get('[label="Type of work"]')
      .shadow()
      .find('select')
      .select(employer.type);
    cy.get('[label="Type of work"]')
      .shadow()
      .find('select')
      .select('');
    cy.get('#errorable-select-1-error-message').should('exist');
    cy.get('[label="Type of work"]')
      .shadow()
      .find('select')
      .select(employer.type);
    cy.get('#errorable-select-1-error-message').should('not.exist');

    cy.fillDate(
      'from',
      `${employer.from.split('-')[0]}-${employer.from.split('-')[1]}`,
    );

    cy.get(':nth-child(2) > .hydrated')
      .shadow()
      .find('#error-message')
      .should('exist')
      .should('contain', 'start date.');

    if (employer.isCurrent) {
      cy.get(`input[label="Employer name]`).check();
    } else {
      cy.fillDate(
        'to',
        `${employer.to.split('-')[0]}-${employer.to.split('-')[1]}`,
      );
    }

    cy.get(`[label="Employer name]`)
      .shadow()
      .find('input')
      .type(employer.employerName);

    cy.get(`[label="Employer name]`).clear();
    cy.get('#errorable-text-input-1-error-message')
      .should('exist')
      .should('contain', 'employer name');
    cy.get(`[label="Employer name]`)
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

export default new EnhancedEmploymentRecords();
