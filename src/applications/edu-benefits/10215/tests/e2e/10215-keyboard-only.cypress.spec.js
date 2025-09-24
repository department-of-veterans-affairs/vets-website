import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import testData from '../fixtures/data/test-data.json';
import { SUBMIT_URL } from '../../config/constants';
import { daysAgoYyyyMmDd } from '../../helpers';

describe('22-10215 Edu Benefits Form', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
  });
  it('should be keyboard-only navigable', () => {
    const testDataShallowCopy = { ...testData };
    testDataShallowCopy.data.institutionDetails.termStartDate = daysAgoYyyyMmDd(
      14,
    );
    testDataShallowCopy.data.institutionDetails.dateOfCalculations = daysAgoYyyyMmDd(
      10,
    );
    cy.intercept('POST', SUBMIT_URL, testDataShallowCopy);
    const institutionOfficial = {
      first: 'Jane',
      last: 'Doe',
      title: 'President',
    };

    const institutionDetail = {
      institutionName: 'Test Institution Name',
      facilityCode: '15012020',
      termStartDate: daysAgoYyyyMmDd(15),
      dateOfCalculations: daysAgoYyyyMmDd(10),
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
    // Go to application intro page
    cy.visit(`${manifest.rootUrl}/introduction`);
    cy.injectAxeThenAxeCheck();
    cy.focused().should('contain.text', 'Report 85/15 rule enrollment ratios');
    cy.repeatKey('Tab', 6);
    cy.focused().should(
      'contain.text',
      'What are the due dates for submitting my 85/15 rule enrollment ratios?',
    );
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'What happens after I submit my 85/15 rule enrollment ratios?',
    );
    cy.realPress('Space');
    cy.realPress('Tab');
    cy.focused().should(
      'contain.text',
      'How do I request an exemption from routine 85/15 rule enrollment ratio reporting? ',
    );

    // Tab to and press 'Start your form without signing in' to go to the introduction page
    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');

    // Institution Official Page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionOfficial
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_certifyingOfficial_first"]');
    cy.typeInFocused(institutionOfficial.first);
    cy.tabToElement('[name="root_certifyingOfficial_last"]');
    cy.typeInFocused(institutionOfficial.last);
    cy.tabToElement('[name="root_certifyingOfficial_title"]');
    cy.typeInFocused(institutionOfficial.title);
    cy.tabToContinueForm();

    // Institution Details Page
    cy.url().should(
      'include',
      formConfig.chapters.institutionDetailsChapter.pages.institutionDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_institutionDetails_facilityCode',
      institutionDetail.facilityCode,
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);

    cy.realPress('Tab');
    cy.fillVaMemorableDate(
      'root_institutionDetails_termStartDate',
      institutionDetail.termStartDate,
      true,
    );
    cy.realPress('Tab');
    cy.fillVaMemorableDate(
      'root_institutionDetails_dateOfCalculations',
      institutionDetail.dateOfCalculations,
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
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_studentsEnrolled',
      calculationDetail.totalNumberOfStudentsEnrolled,
    );
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_studentsEnrolled',
      calculationDetail.totalNumberOfStudentsEnrolled,
    );
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_supportedStudents',
      calculationDetail.totalNumberOfSupportedStudentsEnrolled,
    );
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_fte_supported',
      calculationDetail.numberOfSupportedStudentsFTE,
    );
    cy.realPress('Tab');
    cy.fillVaTextInput(
      'root_fte_nonSupported',
      calculationDetail.numberOfNonSupportedStudentsFTE,
    );
    cy.tabToContinueForm();

    // Program Summary Page
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

    // How to submit your form
    cy.url().should(
      'include',
      formConfig.chapters.submissionInstructionsChapter.pages
        .submissionInstructions.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToContinueForm();

    // Review application
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    // The 'Note' above the Certification statement should be hidden
    cy.get('va-statement-of-truth')
      .shadow()
      .find('p.font-sans-6')
      .should('have.css', 'display', 'none');
    cy.get('#veteran-signature')
      .shadow()
      .get('#inputField')
      .type(`${institutionOfficial.first} ${institutionOfficial.last}`);
    cy.tabToElementAndPressSpace('va-checkbox');
    // 'Submit' form
    cy.tabToElement('.usa-button-primary').click();

    // Confirmation page
    cy.location('pathname').should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
    // Default focus to h2
    cy.focused().should(
      'contain.text',
      'To submit your form, follow the steps below',
    );
    // Go back to review page and check that "Continue" button is present to allow re-submission
    cy.get('va-link[text="Back"]').click();
    cy.location('pathname').should('include', '/review-and-submit');
    cy.tabToElement('.usa-button-primary').click();
    cy.location('pathname').should('include', '/confirmation');
  });
});
