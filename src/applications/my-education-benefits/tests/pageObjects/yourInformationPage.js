import { mebUser } from '../fixtures/data/userResponse';
import { claimantResponse } from '../fixtures/data/claimantInfoResponse';

class yourInformationPage {
  getYourFirstName() {
    return cy.get('input[id="root_view:userFullName_userFullName_first"]');
  }

  getYourMiddleName() {
    return cy.get('input[id="root_view:userFullName_userFullName_middle"]');
  }

  getYourLastName() {
    return cy.get('input[id="root_view:userFullName_userFullName_last"]');
  }

  getYourSuffix() {
    return cy.get('input[id="root_view:userFullName_userFullName_suffix"]');
  }

  getBirthMonth() {
    return cy.get('select[id="root_dateOfBirthMonth"]');
  }

  getBirthDay() {
    return cy.get('select[id="root_dateOfBirthDay"]');
  }

  getBirthYear() {
    return cy.get('input[id="root_dateOfBirthYear"]');
  }

  clickContinueButton() {
    return cy.findByText('Continue').click();
  }

  verifyYourInfoPagePrefillData() {
    this.getYourFirstName().should(
      'have.value',
      mebUser.data.attributes.profile.firstName,
    );
    this.getYourMiddleName().should(
      'have.value',
      mebUser.data.attributes.profile.middleName,
    );
    this.getYourLastName().should(
      'have.value',
      mebUser.data.attributes.profile.lastName,
    );
    let birthMonthNum = claimantResponse.data.attributes.claimant.dateOfBirth.substring(
      5,
      7,
    );
    let birthDayNum = claimantResponse.data.attributes.claimant.dateOfBirth.substring(
      8,
    );
    let birthYearNum = claimantResponse.data.attributes.claimant.dateOfBirth.substring(
      0,
      4,
    );
    if (birthMonthNum.startsWith('0')) {
      birthMonthNum = birthMonthNum.substring(1, 2);
    }
    if (birthDayNum.startsWith('0')) {
      birthDayNum = birthDayNum.substring(1, 2);
    }
    if (birthYearNum.startsWith('0')) {
      birthYearNum = birthYearNum.substring(1, 2);
    }
    this.getBirthMonth().should('have.value', birthMonthNum);
    this.getBirthDay().should('have.value', birthDayNum);
    this.getBirthYear().should('have.value', birthYearNum);
  }
}

export default yourInformationPage;
