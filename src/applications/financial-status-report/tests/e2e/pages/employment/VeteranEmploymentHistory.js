import EmploymentRecords from './EmploymentRecords';

class VeteranEmploymentHistory {
  employers = [
    {
      type: 'Full time',
      from: '2017-1-XX',
      to: '',
      isCurrent: true,
      employerName: 'Veteran Current One',
    },
    {
      type: 'Full time',
      from: '2015-1-XX',
      to: '2017-1-XX',
      isCurrent: false,
      employerName: 'Veteran Previous Two',
    },
  ];

  fillEmployerInfo = () => {
    // Employer One - Current Employment
    EmploymentRecords.employerFill(this.employers[0]);
    // Add job link
    EmploymentRecords.addEmployer();
    // Employer Two - Previous Employment
    EmploymentRecords.employerFill(this.employers[1]);
  };

  attemptNextPage = () => {
    cy.get('.usa-button-primary').click();
  };
}

export default new VeteranEmploymentHistory();
