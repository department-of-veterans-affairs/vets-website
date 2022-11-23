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

  attemptNextPage = () => {
    cy.get('.usa-button-primary').click();
  };
}

export default new EnhancedVeteranEmploymentHistory();
