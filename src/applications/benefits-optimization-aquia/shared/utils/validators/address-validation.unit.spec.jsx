import { expect } from 'chai';
import sinon from 'sinon';
import {
  prepareAddressForAPI,
  formatAddress,
  fetchSuggestedAddress,
} from './address-validation';

describe('address-validation utils', () => {
  describe('prepareAddressForAPI', () => {
    it('converts a domestic address to API format', () => {
      const address = {
        street: '37 N 1st St',
        street2: 'Apt 2',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      };

      const result = prepareAddressForAPI(address);

      expect(result.address_line1).to.equal('37 N 1st St');
      expect(result.address_line2).to.equal('Apt 2');
      expect(result.address_pou).to.equal('CORRESPONDENCE');
      expect(result.address_type).to.equal('DOMESTIC');
      expect(result.city).to.equal('Brooklyn');
      expect(result.country_code_iso3).to.equal('USA');
      expect(result.state_code).to.equal('NY');
      expect(result.zip_code).to.equal('11249');
    });

    it('sets address_type to INTERNATIONAL for non-USA addresses', () => {
      const address = {
        street: '123 Main St',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 2T6',
        country: 'CAN',
      };

      const result = prepareAddressForAPI(address);
      expect(result.address_type).to.equal('INTERNATIONAL');
      expect(result.country_code_iso3).to.equal('CAN');
    });

    it('defaults country to USA when not provided', () => {
      const address = {
        street: '123 Main St',
        city: 'Richmond',
        state: 'VA',
        postalCode: '23219',
      };

      const result = prepareAddressForAPI(address);
      expect(result.country_code_iso3).to.equal('USA');
      expect(result.address_type).to.equal('DOMESTIC');
    });
  });

  describe('formatAddress', () => {
    it('formats a full domestic address', () => {
      const address = {
        street: '37 N 1st St',
        street2: 'Apt 2',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      };

      const result = formatAddress(address);
      expect(result).to.equal('37 N 1st St, Apt 2, Brooklyn, NY 11249');
    });

    it('omits street2 when not present', () => {
      const address = {
        street: '37 N 1st St',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      };

      const result = formatAddress(address);
      expect(result).to.equal('37 N 1st St, Brooklyn, NY 11249');
    });

    it('includes country name for non-USA addresses', () => {
      const address = {
        street: '123 Main St',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 2T6',
        country: 'CAN',
      };

      const result = formatAddress(address);
      expect(result).to.include('Canada');
    });

    it('returns empty string for null input', () => {
      expect(formatAddress(null)).to.equal('');
    });

    it('handles API field names (addressLine1, stateCode, etc.)', () => {
      const address = {
        addressLine1: '37 N 1st St',
        city: 'Brooklyn',
        stateCode: 'NY',
        zipCode: '11249',
        countryCodeIso3: 'USA',
      };

      const result = formatAddress(address);
      expect(result).to.equal('37 N 1st St, Brooklyn, NY 11249');
    });
  });

  describe('fetchSuggestedAddress', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sinon.stub(global, 'fetch');
    });

    afterEach(() => {
      fetchStub.restore();
    });

    it('returns suggestedAddress and showSuggestions=false when confidence is 100', async () => {
      fetchStub.resolves({
        ok: true,
        json: () =>
          Promise.resolve({
            addresses: [
              {
                address: {
                  addressLine1: '37 N 1st St',
                  city: 'Brooklyn',
                  countryCodeIso3: 'USA',
                  stateCode: 'NY',
                  zipCode: '11249',
                },
                addressMetaData: {
                  confidenceScore: 100,
                  deliveryPointValidation: 'CONFIRMED',
                },
              },
            ],
          }),
      });

      const result = await fetchSuggestedAddress({
        street: '37 N 1st St',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      });

      expect(result.showSuggestions).to.be.false;
      expect(result.confidenceScore).to.equal(100);
      expect(result.suggestedAddress.street).to.equal('37 N 1st St');
    });

    it('returns showSuggestions=true when confidence is below 100', async () => {
      fetchStub.resolves({
        ok: true,
        json: () =>
          Promise.resolve({
            addresses: [
              {
                address: {
                  addressLine1: '37 North 1st Street',
                  city: 'Brooklyn',
                  countryCodeIso3: 'USA',
                  stateCode: 'NY',
                  zipCode: '11249',
                },
                addressMetaData: {
                  confidenceScore: 85,
                  deliveryPointValidation: 'CONFIRMED',
                },
              },
            ],
          }),
      });

      const result = await fetchSuggestedAddress({
        street: '37 N 1st St',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      });

      expect(result.showSuggestions).to.be.true;
      expect(result.confidenceScore).to.equal(85);
    });

    it('returns fallback when API call fails', async () => {
      fetchStub.rejects(new Error('Network error'));

      const result = await fetchSuggestedAddress({
        street: '37 N 1st St',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11249',
        country: 'USA',
      });

      expect(result.suggestedAddress).to.be.null;
      expect(result.showSuggestions).to.be.false;
    });
  });
});
