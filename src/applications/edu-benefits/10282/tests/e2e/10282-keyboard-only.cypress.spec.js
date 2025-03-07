import maximalData from '../fixtures/data/maximal-test.json';
import formConfig from '../../config/form';

describe('22-10282 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    // Go to application, should go to intro page
    cy.visit(
      'education/other-va-education-benefits/ibm-skillsbuild-program/apply-form-22-10282',
    );
    cy.injectAxeThenAxeCheck();
    // Tab to and press 'Start your application'
    cy.repeatKey('Tab', 2);
    cy.realPress(['Enter']);

    // Applicant name page
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantName.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.veteranFullName.first);
    cy.repeatKey('Tab', 2);
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
        'input#root_veteranDescveteraninput',
        'input#root_veteranDescveteransSpouseinput',
        'input#root_veteranDescveteransChildinput',
        'input#root_veteranDescveteransCaregiverinput',
        'input#root_veteranDescactivedutyinput',
        'input#root_veteranDescnationalGuardinput',
        'input#root_veteranDescreservistinput',
        'input#root_veteranDescindividualReadyReserveinput',
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
    cy.chooseSelectOptionByTyping('Texas');
    cy.tabToContinueForm();

    // Tab to and select 'no' to optional demographic questions
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.genderRaceQuestion.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[name="root_raceAndGender"]');
    cy.allyEvaluateRadioButtons(
      ['input#root_raceAndGenderYesinput', 'input#root_raceAndGenderNoinput'],
      'ArrowDown',
    );
    cy.chooseRadio('N');
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
    cy.tabToElement('input[name="root_raceAndGender"]');
    cy.chooseRadio('Y');
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
        'input#root_ethnicityHLinput',
        'input#root_ethnicityNHLinput',
        'input#root_ethnicityNAinput',
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
        'input#root_genderWinput',
        'input#root_genderMinput',
        'input#root_genderTWinput',
        'input#root_genderTMinput',
        'input#root_genderNBinput',
        'input#root_gender0input',
        'input#root_genderNAinput',
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
        'input#root_highestLevelOfEducation_levelHSinput',
        'input#root_highestLevelOfEducation_levelADinput',
        'input#root_highestLevelOfEducation_levelBDinput',
        'input#root_highestLevelOfEducation_levelMDinput',
        'input#root_highestLevelOfEducation_levelDDinput',
        'input#root_highestLevelOfEducation_levelNAinput',
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
      [
        'input#root_currentlyEmployedYesinput',
        'input#root_currentlyEmployedNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
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
        'input#root_currentAnnualSalarylessThanTwentyinput',
        'input#root_currentAnnualSalarytwentyToThirtyFiveinput',
        'input#root_currentAnnualSalarythirtyFiveToFiftyinput',
        'input#root_currentAnnualSalaryfiftyToSeventyFiveinput',
        'input#root_currentAnnualSalarymoreThanSeventyFiveinput',
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
        'input#root_isWorkingInTechIndustryYesinput',
        'input#root_isWorkingInTechIndustryNoinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio('Y');
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
        'input#root_techIndustryFocusAreaCPinput',
        'input#root_techIndustryFocusAreaCSinput',
        'input#root_techIndustryFocusAreaDPinput',
        'input#root_techIndustryFocusAreaISinput',
        'input#root_techIndustryFocusAreaMAinput',
        'input#root_techIndustryFocusAreaNAinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.techIndustryFocusArea);
    cy.tabToContinueForm();

    // Review page - submit form
    cy.tabToElementAndPressSpace('va-text-input');
    cy.typeInFocused('Jane Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();

    // Confirmation page
    cy.location('pathname').should('include', '/confirmation');
  });
});
