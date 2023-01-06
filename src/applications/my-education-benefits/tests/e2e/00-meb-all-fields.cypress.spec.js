/// <reference types='cypress' />
import { mebUser } from '../fixtures/data/userResponse';
import { claimantResponse } from '../fixtures/data/claimantInfoResponse';
import { eligibilityResponse } from '../fixtures/data/eligibilityResponse';
import Ch33MainPage from '../pageObjects/ch33MainPage';
import YourInformationPage from '../pageObjects/yourInformationPage';
import PhoneAndEmailPage from '../pageObjects/phoneAndEmailPage';
import MailingAddressPage from '../pageObjects/mailingAddressPage';
import FollowUpPage from '../pageObjects/followUpPage';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const mainPage = new Ch33MainPage();
const yourInfoPage = new YourInformationPage();
const phoneAndEmailPage = new PhoneAndEmailPage();
const mailingAddressPage = new MailingAddressPage();
const followUpPage = new FollowUpPage();
describe('All Field prefilled tests for My Education Benefits app', () => {
  beforeEach(() => {
    cy.login(mebUser);
    cy.intercept('GET', '/meb_api/v0/claimant_info', claimantResponse).as(
      'mockClaimantInfoResponse',
    );
    cy.intercept('GET', '/meb_api/v0/eligibility', eligibilityResponse).as(
      'mockEligiblityResponse',
    );
    cy.visit(
      'http://localhost:3001/education/apply-for-benefits-form-22-1990/introduction',
    );

    mainPage.getStartYourApplicationLink().click();
  });

  it('Your information page fields are prefilled', () => {
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/apply-for-benefits-form-22-1990/applicant-information/personal-information',
    );
  });

  it('MEB phone and email page fields are prefilled', () => {
    yourInfoPage.verifyYourInfoPagePrefillData();
    yourInfoPage.clickContinueButton();

    cy.url().should(
      'include',
      '/education/apply-for-benefits-form-22-1990/contact-information/email-phone',
    );
    cy.injectAxeThenAxeCheck();
    phoneAndEmailPage
      .getMobilePhoneNumber()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.mobilePhoneNumber,
      );
    phoneAndEmailPage
      .getHomePhoneNumber()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.homePhoneNumber,
      );
    phoneAndEmailPage
      .getEmailAdd()
      .should('have.value', mebUser.data.attributes.profile.email);
    phoneAndEmailPage
      .getConfirmEmailAdd()
      .should('have.value', mebUser.data.attributes.profile.email);
  });

  it('MEB mailing address page fields are prefilled', () => {
    yourInfoPage.verifyYourInfoPagePrefillData();
    yourInfoPage.clickContinueButton();
    phoneAndEmailPage.verifyPhoneAndEmailPagePrefillData();
    yourInfoPage.clickContinueButton();

    cy.url().should(
      'include',
      'education/apply-for-benefits-form-22-1990/contact-information/mailing-address',
    );
    cy.injectAxeThenAxeCheck();

    mailingAddressPage
      .getCountry()
      .should(
        'have.text',
        regionNames.of(
          claimantResponse.data.attributes.claimant.contactInfo.countryCode,
        ),
      );
    mailingAddressPage
      .getAddLine1()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.addressLine1,
      );
    mailingAddressPage
      .getAddLine2()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.addressLine2,
      );
    mailingAddressPage
      .getCity()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.city,
      );
    mailingAddressPage
      .getState()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.stateCode,
      );
    mailingAddressPage
      .getZipCode()
      .should(
        'have.value',
        claimantResponse.data.attributes.claimant.contactInfo.zipcode,
      );
  });

  it('MEB follow up page fields are prefilled', () => {
    yourInfoPage.verifyYourInfoPagePrefillData();
    yourInfoPage.clickContinueButton();
    phoneAndEmailPage.verifyPhoneAndEmailPagePrefillData();
    yourInfoPage.clickContinueButton();
    mailingAddressPage.verifyMailingAddPagePrefillData();
    yourInfoPage.clickContinueButton();

    cy.url().should(
      'include',
      'education/apply-for-benefits-form-22-1990/contact-information/contact-preferences',
    );
    cy.injectAxeThenAxeCheck();
    followUpPage
      .getListOfAllContactMethodRadioButtons()
      .should('have.length', 4);
    followUpPage.getEmailContactMethodRadioButton().click();
    followUpPage.getListOfNotificationRadioButtons().should('have.length', 2);

    if (
      claimantResponse.data.attributes.claimant.notificationMethod === 'EMAIL'
    ) {
      followUpPage.getNoJustSendMeEmailButton().should('be.checked');
    } else if (
      claimantResponse.data.attributes.claimant.notificationMethod === 'TEXT'
    ) {
      followUpPage.getYesSendMeTextMessageButton().should('be.checked');
    } else {
      followUpPage.getNoJustSendMeEmailButton().click();
    }

    yourInfoPage.clickContinueButton();
  });
});
