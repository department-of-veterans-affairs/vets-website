import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../../manifest.json';
import maximalData from '../fixtures/data/maximal.json';
import formConfig from '../../config/form';

describe('22-10282 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    // Go to application, should go to intro page
    cy.visit(`${manifest.rootUrl}`);
    cy.injectAxeThenAxeCheck();
    // Tab to and press 'Start your application'
    cy.realPress(['Tab', 'Enter']);

    // Applicant name page
    cy.url({ timeout: Timeouts.slow }).should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('#root_veteranFullName_first');
    cy.typeInFocused(maximalData.data.veteranFullName.first);
    cy.tabToElement('#root_veteranFullName_middle');
    cy.typeInFocused(maximalData.data.veteranFullName.middle);
    cy.tabToElement('#root_veteranFullName_last');
    cy.typeInFocused(maximalData.data.veteranFullName.last);
    cy.tabToContinueForm();

    // Applicant description page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.veteranDesc.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_veteranDesc_0',
        'input#root_veteranDesc_1',
        'input#root_veteranDesc_2',
        'input#root_veteranDesc_3',
        'input#root_veteranDesc_4',
        'input#root_veteranDesc_5',
        'input#root_veteranDesc_6',
        'input#root_veteranDesc_7',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.veteranDesc);
    cy.tabToContinueForm();

    // Contact info page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.contactInfo.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_contactInfo_email"]');
    cy.typeInFocused(maximalData.data.contactInfo.email);
    cy.tabToElement('[name="root_contactInfo_mobilePhone"]');
    cy.typeInFocused(maximalData.data.contactInfo.mobilePhone);
    cy.tabToElement('[name="root_contactInfo_homePhone"]');
    cy.typeInFocused(maximalData.data.contactInfo.homePhone);
    cy.tabToContinueForm();

    // Country page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantCountry.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_country"]');
    cy.chooseSelectOptionByTyping(maximalData.data.country);
    cy.tabToContinueForm();

    // State selection page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantState.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_state"]');
    cy.chooseSelectOptionByTyping(maximalData.data.state);
    cy.tabToContinueForm();

    // Tab to and select 'no' to optional demographic questions
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.genderRaceQuestion.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      ['input#root_raceAndGender_0', 'input#root_raceAndGender_1'],
      'ArrowDown',
    );
    cy.chooseRadio('No');
    cy.realPress('Space');
    cy.tabToContinueForm();

    // Check path - should skip to education & employment history questions
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .highestLevelOfEducation.path,
    );

    // Go back to optional demographic questions page
    cy.tabToElement('button[class="usa-button-secondary"]');
    cy.realPress('Space');
    // Choose 'yes' this time
    cy.realPress('Tab');
    cy.chooseRadio('Yes');
    cy.tabToContinueForm();

    // Check path - should skip to education & employment history questions
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantRaceAndEthnicity
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_ethnicity_0',
        'input#root_ethnicity_1',
        'input#root_ethnicity_2',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.ethnicity);
    cy.realPress('Tab');
    cy.allyEvaluateCheckboxes(['input[type="checkbox"]']);
    cy.setCheckboxFromData('[name="root_originRace_noAnswer"]', true);
    cy.tabToContinueForm();

    // Select gender page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantGender.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_gender_0',
        'input#root_gender_1',
        'input#root_gender_2',
        'input#root_gender_3',
        'input#root_gender_4',
        'input#root_gender_5',
        'input#root_gender_6',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.gender);
    cy.tabToContinueForm();

    // Highest level of education page
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .highestLevelOfEducation.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_highestLevelOfEducation_level_0',
        'input#root_highestLevelOfEducation_level_1',
        'input#root_highestLevelOfEducation_level_2',
        'input#root_highestLevelOfEducation_level_3',
        'input#root_highestLevelOfEducation_level_4',
        'input#root_highestLevelOfEducation_level_5',
      ],
      'ArrowDown',
    );
    cy.repeatKey('ArrowDown', 2);
    cy.tabToContinueForm();

    // Currently employed page
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages.currentlyEmployed
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      ['input#root_currentlyEmployed_0', 'input#root_currentlyEmployed_1'],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.currentlyEmployed);
    cy.tabToContinueForm();

    // Current salary page
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .currentAnnualSalary.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_currentAnnualSalary_0',
        'input#root_currentAnnualSalary_1',
        'input#root_currentAnnualSalary_2',
        'input#root_currentAnnualSalary_3',
        'input#root_currentAnnualSalary_4',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.currentAnnualSalary);
    cy.tabToContinueForm();

    // Work in technology industry page
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .isWorkingInTechIndustry.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_isWorkingInTechIndustry_0',
        'input#root_isWorkingInTechIndustry_1',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.isWorkingInTechIndustry);
    cy.tabToContinueForm();

    // Area of focus in tech page
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .techIndustryFocusArea.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_techIndustryFocusArea_0',
        'input#root_techIndustryFocusArea_1',
        'input#root_techIndustryFocusArea_2',
        'input#root_techIndustryFocusArea_3',
        'input#root_techIndustryFocusArea_4',
        'input#root_techIndustryFocusArea_5',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.techIndustryFocusArea);
    cy.tabToContinueForm();

    // Review page - submit form
    cy.repeatKey('Tab', 5);
    cy.typeInFocused(
      `${maximalData.data.veteranFullName.first} ${
        maximalData.data.veteranFullName.last
      }`,
    );
    cy.realPress(['Tab', 'Space']);
    cy.tabToSubmitForm();

    // Confirmation page
    // cy.location('pathname').should('include', '/confirmation');
  });
});
