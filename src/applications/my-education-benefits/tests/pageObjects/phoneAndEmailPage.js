import { mebUser } from '../fixtures/data/userResponse';
import { claimantResponse } from '../fixtures/data/claimantInfoResponse';

class phoneAndEmailPage {
  getMobilePhoneNumber() {
    return cy.findByLabelText('Mobile phone number');
  }

  getHomePhoneNumber() {
    return cy.findByLabelText('Home phone number');
  }

  getEmailAdd() {
    return cy.get('#root_email_email');
  }

  getConfirmEmailAdd() {
    return cy.get('#root_email_confirmEmail');
  }

  verifyPhoneAndEmailPagePrefillData() {
    this.getMobilePhoneNumber().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.mobilePhoneNumber,
    );
    this.getHomePhoneNumber().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.homePhoneNumber,
    );
    this.getEmailAdd().should(
      'have.value',
      mebUser.data.attributes.profile.email,
    );
    this.getConfirmEmailAdd().should(
      'have.value',
      mebUser.data.attributes.profile.email,
    );
  }
}

export default phoneAndEmailPage;
