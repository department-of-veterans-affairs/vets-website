import EmploymentRecords from './EmploymentRecords';

class SpouseEmploymentHistory {
  employers = [
    {
      type: 'Full time',
      from: '2015-5-XX',
      to: '',
      isCurrent: true,
      employerName: 'Spouse Current One',
    },
    {
      type: 'Full time',
      from: '2013-2-XX',
      to: '2018-3-XX',
      isCurrent: false,
      employerName: 'Spouse Previous Two',
    },
  ];

  fillEmployerInfo = () => {
    // Employer One - Current Employment
    EmploymentRecords.employerFill(this.employers[0]);
  };

  attemptNextPage = () => {
    cy.get('.usa-button-primary').click();
  };
}

export default new SpouseEmploymentHistory();
