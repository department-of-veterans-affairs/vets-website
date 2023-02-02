import EnhancedEmploymentRecords from './EnhancedEmploymentRecords';

class EnhancedVeteranEmploymentHistory {
  employers = [
    {
      type: 'Full time',
      from: '2017-1-XX',
      to: '',
      isCurrent: true,
      employerName: 'Veteran Current One',
    },
  ];

  fillEmployerInfo = () => {
    // Employer One - Current Employment
    EnhancedEmploymentRecords.employerFill(this.employers[0]);
  };

  fillFailEmployerInfo = () => {
    EnhancedEmploymentRecords.failValidationEmployerFill(this.employers[0]);
  };

  attemptNextPage = () => {
    cy.get('.usa-button-primary').click();
  };

  goBackAndValidateInput = (selector, value) => {
    cy.get('#\\37 -continueButton').click();
    cy.get(`${selector}`)
      .shadow()
      .find('input')
      .should('have.value', value);
  };
}

export default new EnhancedVeteranEmploymentHistory();
