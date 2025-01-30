import manifest from '../../manifest.json';
import formConfig from '../../config/form';

describe('22-10215 Edu Benefits Form', () => {
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
  });
  it('should be keyboard-only navigable', () => {
    const institutionDetail = {
      institutionName: 'Test Institution Name',
      facilityCode: '12345678',
      termStartDate: '2000-01-01',
      dateOfCalculations: '2010-01-01',
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
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    // Go to application, should go to about page
    cy.visit(`${manifest.rootUrl}`);
    cy.injectAxeThenAxeCheck();

    cy.tabToElement(
      'va-accordion-item[header="What are the due dates for submitting my 85/15 Rule enrollment ratios?"]',
    );
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'What happens after I submit my 85/15 Rule enrollment ratios?',
    );
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'How do I request an exemption from routine 85/15 Rule enrollment ratio reporting?',
    );

    // // Tab to and press 'Start your 85/15 enrollment ratios report' to go to the introduction page
    cy.tabToElement('[text="Start your 85/15 enrollment ratios report"]');
    cy.realPress('Enter');

    // Institution Details Page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.fillVaTextInput(
      'root_institutionDetails_institutionName',
      institutionDetail.institutionName,
    );
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
      institutionDetail.termStartDate,
      true,
    );
    cy.repeatKey('Tab', 1);
    cy.fillVaMemorableDate(
      'root_institutionDetails_dateOfCalculations',
      '2010-01-01',
      true,
    );
    cy.tabToContinueForm();

    // Step 2 Program Intro
    cy.url().should(
      'include',
      formConfig.chapters.programsChapter.pages.programsIntro.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Step 2 Add A program
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 2);
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

    cy.tabToContinueForm();

    //   Program Summary Page
    cy.url().should(
      'include',
      formConfig.chapters.programsChapter.pages.programsSummary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.selectVaRadioOption(
      'root_view:programsSummary',
      reviewYourProgram.doYouHaveAnotherProgramToAddNo,
    );
    cy.tabToContinueForm();

    //   How to submit your form
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Review application
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToSubmitForm();
  });
});
