import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

describe('10297 Keyboard Only Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '/v0/edu-benefits/10297/maximal-test', {
      data: maximalData,
    });
    cy.visit(manifest.rootUrl);
  });

  it('should navigate through the form using keyboard only', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('h1').contains(formConfig.title);
    cy.repeatKey('Tab', 2);
    cy.realPress(['Enter']);
    cy.url().should(
      'include',
      formConfig.chapters.eligibilityChapter.pages.eligibilityQuestions.path,
    );
    cy.realPress('Tab');
    // cy.realPress('Space');
    // cy.chooseRadio(maximalData.data.dutyRequirement);
    cy.allyEvaluateRadioButtons(
      [
        'input#root_dutyRequirementatLeast3Yearsinput',
        'input#root_dutyRequirementbyDischargeinput',
        'input#root_dutyRequirementnoneinput',
      ],
      'ArrowDown',
    );
    cy.chooseRadio(maximalData.data.dutyRequirement);
    cy.realPress('Tab');
    cy.fillVaMemorableDate('root_dateOfBirth', maximalData.data.dateOfBirth);
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_otherThanDishonorableDischargeYesinput',
        'input#root_otherThanDishonorableDischargeNoinput',
      ],
      'ArrowDown',
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.eligibilityChapter.pages.eligibilitySummary.path,
    );
    cy.repeatKey('Tab', 2);
    cy.realPress('Enter');
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.applicantFullName.path,
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.applicantFullName.first);
    cy.repeatKey('Tab', 2);
    cy.typeInFocused(maximalData.data.applicantFullName.last);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.mailingAddress.path,
    );
    cy.repeatKey('Tab', 2);
    cy.selectVaSelect(
      'root_mailingAddress_country',
      maximalData.data.mailingAddress.country,
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.mailingAddress.street);
    cy.repeatKey('Tab', 3);
    cy.typeInFocused(maximalData.data.mailingAddress.city);
    cy.repeatKey('Tab', 1);
    cy.selectVaSelect(
      'root_mailingAddress_state',
      maximalData.data.mailingAddress.state,
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.mailingAddress.postalCode);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.phoneAndEmail.path,
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.contactInfo.homePhone);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.identificationInformation
        .path,
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.ssn);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.dateReleasedFromActiveDuty
        .path,
    );
    cy.realPress('Tab');
    cy.fillVaMemorableDate(
      'root_dateReleasedFromActiveDuty',
      maximalData.data.dateReleasedFromActiveDuty,
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.activeDutyStatus.path,
    );
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_hasCompletedActiveDutyYesinput',
        'input#root_hasCompletedActiveDutyNoinput',
      ],
      'ArrowDown',
    );
    // cy.chooseRadio(maximalData.data.hasCompletedActiveDuty);
    cy.tabToContinueForm();
    // cy.url().should(
    //   'include',
    //   formConfig.chapters.identificationChapter.pages.directDeposit.path,
    // );
    // cy.realPress('Tab');

    // cy.typeInFocused(maximalData.data.mailingAddress.state);
    // cy.repeatKey('Tab', 2);
    // cy.typeInFocused(maximalData.data.mailingAddress.postalCode);
    // cy.tabToContinueForm();

    // cy.tabToContinueForm();
  });
});
