import manifest from '../../manifest.json';

describe('10215 EDU Benefits accessibility', () => {
  it('should traverses content via keyboard', () => {
    cy.visit(`${manifest.rootUrl}`);
    const institutionDetail = {
      institutionName: 'Test Institution Name',
      facilityCode: '12345678',
    };
    const calculationDetail = {
      programName: 'Test Program Name',
      totalNumberOfStudentsEnrolled: 130,
      totalNumberOfSupportedStudentsEnrolled: 40,
      numberOfSupportedStudentsFTE: 20,
      numberOfNonSupportedStudentsFTE: 10,
    };
    const reviewYourProgram = {
      doYouHaveAnotherProgramToAddYES: 'Y',
      doYouHaveAnotherProgramToAddNo: 'N',
    };
    cy.injectAxeThenAxeCheck();
    cy.get('va-breadcrumbs')
      .shadow()
      .find('nav li > a')
      .first()
      .focus();
    cy.focused().should('contain.text', 'VA.gov home');
    cy.repeatKey('Tab', 3);
    cy.focused().should('contain.text', 'Title 38 United States Code');
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', '38 Code of Federal Regulations');
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'School Certifying Official Handbook');
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'Review the calculation instructions');
    cy.repeatKey('Tab', 5);
    cy.focused().should(
      'contain.text',
      'Start your 85/15 enrollment ratios report',
    );
    cy.realPress('Enter');
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_institutionDetails_institutionName',
      institutionDetail.institutionName,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_institutionDetails_facilityCode',
      institutionDetail.facilityCode,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaMemorableDate(
      'root_institutionDetails_termStartDate',
      '2000-01-01',
      true,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaMemorableDate(
      'root_institutionDetails_dateOfCalculations',
      '2010-01-01',
      true,
    );
    cy.tabToContinueForm();
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'Review the calculation instructions');
    cy.tabToContinueForm();
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'Review the calculation instructions');
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput('root_programName', calculationDetail.programName);
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_studentsEnrolled',
      calculationDetail.totalNumberOfStudentsEnrolled,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_studentsEnrolled',
      calculationDetail.totalNumberOfStudentsEnrolled,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_supportedStudents',
      calculationDetail.totalNumberOfSupportedStudentsEnrolled,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_fte_supported',
      calculationDetail.numberOfSupportedStudentsFTE,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_fte_nonSupported',
      calculationDetail.numberOfNonSupportedStudentsFTE,
    );
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'How is Total enrolled FTE calculated');
    cy.repeatKey('Tab', 1);
    cy.focused().should(
      'contain.text',
      'How is Supported student percentage FTE calculated',
    );
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'Cancel adding this program');
    cy.tabToContinueForm();
    cy.injectAxeThenAxeCheck();
    cy.selectVaRadioOption(
      'root_view:programsSummary',
      reviewYourProgram.doYouHaveAnotherProgramToAddNo,
    );
    cy.tabToContinueForm();
    cy.injectAxeThenAxeCheck();

    cy.tabToContinueForm();
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'Download VA Form 22-10215');
  });
});

//  tabClickContinue(5);
