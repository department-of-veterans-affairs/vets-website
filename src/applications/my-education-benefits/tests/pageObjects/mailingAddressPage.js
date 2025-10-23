import { claimantResponse } from '../fixtures/data/claimantInfoResponse';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
class mailingAddressPage {
  getCountry() {
    return cy.get(
      'select[id*="root_view:mailingAddress_address_country"] option:selected',
    );
  }

  getAddLine1() {
    return cy.get('input[id*="root_view:mailingAddress_address_street"]');
  }

  getAddLine2() {
    return cy.get('input[id*="root_view:mailingAddress_address_street2"]');
  }

  getCity() {
    return cy.get('input[id*="root_view:mailingAddress_address_city"]');
  }

  getState() {
    return cy.get(
      'select[id*="root_view:mailingAddress_address_state"] option:selected',
    );
  }

  getZipCode() {
    return cy.get('input[id*="root_view:mailingAddress_address_postalCode"]');
  }

  verifyMailingAddPagePrefillData() {
    this.getCountry().should(
      'have.text',
      regionNames.of(
        claimantResponse.data.attributes.claimant.contactInfo.countryCode,
      ),
    );
    this.getAddLine1().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.addressLine1,
    );
    this.getAddLine2().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.addressLine2,
    );
    this.getCity().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.city,
    );
    this.getState().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.stateCode,
    );
    this.getZipCode().should(
      'have.value',
      claimantResponse.data.attributes.claimant.contactInfo.zipcode,
    );
  }
}

export default mailingAddressPage;
