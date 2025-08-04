import maximalData from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const futureDate = new Date();
const daysToAdd = 2;
futureDate.setDate(futureDate.getDate() + daysToAdd);
const year = futureDate.getFullYear();
const month = String(futureDate.getMonth() + 1).padStart(2, '0');
const day = String(futureDate.getDate()).padStart(2, '0');
const futureDateString = `${year}-${month}-${day}`;

describe('10297 Keyboard Only Tests', () => {
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
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
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_hasCompletedActiveDutyYesinput',
        'input#root_hasCompletedActiveDutyNoinput',
      ],
      'ArrowDown',
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.identificationChapter.pages.directDeposit.path,
    );
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        'input#root_bankAccount_accountTypecheckinginput',
        'input#root_bankAccount_accountTypesavingsinput',
      ],
      'ArrowDown',
    );
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.bankAccount.accountNumber);
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.bankAccount.routingNumber);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.trainingProviderChapter.pages.trainingProviderSummary
        .path,
    );

    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.selectVaRadioOption('root_view:summary', 'Y');
    cy.tabToContinueForm();
    cy.url().should('include', 'training-provider/0/details');
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.trainingProviderDetails[0].name);
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.selectVaSelect(
      'root_providerAddress_country',
      maximalData.data.trainingProviderDetails[0].address.country,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data.trainingProviderDetails[0].address.street,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
    cy.typeInFocused(maximalData.data.trainingProviderDetails[0].address.city);
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.selectVaSelect(
      'root_providerAddress_state',
      maximalData.data.trainingProviderDetails[0].address.state,
    );
    cy.realPress('Tab');
    cy.typeInFocused(
      maximalData.data.trainingProviderDetails[0].address.postalCode,
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.trainingProviderChapter.pages.trainingProviderSummary
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 3);
    cy.selectVaRadioOption('root_view:summary', 'N');
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.trainingProviderChapter.pages
        .trainingProviderStartDate.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.fillVaMemorableDate('root_plannedStartDate', futureDateString);
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.backgroundInformationChapter.pages.employmentStatus
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.selectVaRadioOption('root_isEmployed', 'Y');
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.backgroundInformationChapter.pages.employmentDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.selectVaRadioOption('root_isInTechnologyIndustry', 'Y');
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.backgroundInformationChapter.pages.employmentFocus
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      ['input#root_technologyAreaOfFocuscomputerProgramminginput'],
      'ArrowDown',
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.backgroundInformationChapter.pages.salaryDetails.path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.typeInFocused(maximalData.data.currentSalary);
    cy.allyEvaluateRadioButtons(
      ['input#root_currentSalarylessThanTwentyinput'],
      'ArrowDown',
    );
    cy.tabToContinueForm();
    cy.url().should(
      'include',
      formConfig.chapters.backgroundInformationChapter.pages.educationDetails
        .path,
    );
    cy.injectAxeThenAxeCheck();
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      ['input#root_highestLevelOfEducationHSinput'],
      'ArrowDown',
    );
    cy.tabToContinueForm();
    cy.url().should('include', 'review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('input[id="inputField"]');
    cy.realType('John Doe');
    cy.tabToElementAndPressSpace('va-checkbox');
    cy.tabToSubmitForm();
    cy.location('pathname').should('include', '/confirmation');
  });
});
