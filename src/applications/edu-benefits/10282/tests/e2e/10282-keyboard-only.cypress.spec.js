import Timeouts from 'platform/testing/e2e/timeouts';
import manifest from '../../manifest.json';
import maximalData from '../fixtures/data/maximal.json';
import formConfig from '../../config/form';

describe('22-10282 Edu form', () => {
  it('should be keyboard-only navigable', () => {
    // Go to application, should go to intro page
    cy.visit(`${manifest.rootUrl}`);
    // Axe check
    cy.injectAxeThenAxeCheck();
    // Tab to and press 'Start your application'
    cy.realPress('Tab');
    cy.realPress('Enter');
    // Check path name
    cy.url({ timeout: Timeouts.slow }).should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantName.path,
    );
    // Axe check
    cy.injectAxeThenAxeCheck();
    // Type in name and continue
    cy.tabToElement('#root_veteranFullName_first');
    cy.typeInFocused(maximalData.data.veteranFullName.first);
    cy.tabToElement('#root_veteranFullName_middle');
    cy.typeInFocused(maximalData.data.veteranFullName.middle);
    cy.tabToElement('#root_veteranFullName_last');
    cy.typeInFocused(maximalData.data.veteranFullName.last);
    cy.tabToContinueForm();
    // Tab to and select "I'm a Veteran" and continue
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.veteranDesc.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.chooseRadio(maximalData.data.veteranDesc);
    cy.tabToContinueForm();
    // Tab to and type in contact info and continue
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
    // Tab to and select country and continue
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantCountry.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('[name="root_country"]');
    cy.chooseSelectOptionByTyping(maximalData.data.country);
    cy.tabToContinueForm();
    // Tab to and select state
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
    // // Check path - should skip to education & employment history questions
    cy.url().should(
      'include',
      formConfig.chapters.educationAndEmploymentHistory.pages
        .highestLevelOfEducation.path,
    );
    // // Go back to optional demographic questions
    cy.tabToElement('button[class="usa-button-secondary"]');
    cy.realPress('Space');
    // Choose 'yes' this time
    cy.realPress('Tab');
    cy.chooseRadio('Yes');
    cy.tabToContinueForm();
    // // Check path - should skip to education & employment history questions
    cy.url().should(
      'include',
      formConfig.chapters.personalInformation.pages.applicantRaceAndEthnicity
        .path,
    );
  });
});
