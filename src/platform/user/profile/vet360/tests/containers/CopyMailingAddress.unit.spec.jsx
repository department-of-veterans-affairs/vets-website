import { expect } from 'chai';

import { FIELD_NAMES } from 'vet360/constants';

import { mapStateToProps } from 'vet360/containers/CopyMailingAddress';

import { convertNextValueToCleanData } from 'vet360/components/AddressField/AddressField';

describe('<CopyMailingAddress/>', () => {
  describe('mapStateToProps', () => {
    let state = null;
    const ownProps = {
      convertNextValueToCleanData,
    };

    beforeEach(() => {
      state = {
        user: {
          profile: {
            vet360: {
              [FIELD_NAMES.MAILING_ADDRESS]: null,
            },
          },
        },
        vet360: {
          formFields: {
            [FIELD_NAMES.MAILING_ADDRESS]: null,
          },
        },
      };
    });

    it('returns the required props', () => {
      const mailingAddress = { city: 'some city' };

      state.user.profile.vet360[FIELD_NAMES.MAILING_ADDRESS] = mailingAddress;
      state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
        city: 'some other city',
      };

      const result = mapStateToProps(state, ownProps);

      expect(result.mailingAddress).to.be.equal(mailingAddress);
      expect(result.hasEmptyMailingAddress).to.be.false;
      expect(result.checked).to.be.false;
    });

    it('returns checked as true when addresses are equal', () => {
      state.user.profile.vet360[FIELD_NAMES.MAILING_ADDRESS] = {
        addressLine1: '1493 Martin Luther King Rd',
        addressLine2: 'string',
        addressLine3: 'string',
        addressPou: 'CORRESPONDENCE',
        addressType: 'domestic',
        city: 'Fulton',
        countryCodeFips: 'US',
        countryCodeIso2: 'US',
        countryCodeIso3: 'USA',
        countryName: 'United States',
        createdAt: '2018-04-21T20:09:50Z',
        effectiveEndDate: '2018-04-21T20:09:50Z',
        effectiveStartDate: '2018-04-21T20:09:50Z',
        id: 123,
        internationalPostalCode: '54321',
        province: 'string',
        sourceDate: '2018-04-21T20:09:50Z',
        stateCode: 'NY',
        updatedAt: '2018-04-21T20:09:50Z',
        zipCode: '97062',
        zipCodeSuffix: '123',
      };

      // This is the same address as above, but converted to the edit-modal form.
      state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
        value: {
          addressLine1: '1493 Martin Luther King Rd',
          addressLine2: 'string',
          addressLine3: 'string',
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Fulton',
          countryName: 'United States',
          id: 123,
          internationalPostalCode: null,
          province: null,
          stateCode: 'NY',
          zipCode: '97062',
        },
      };

      const result = mapStateToProps(state, ownProps);
      expect(result.checked).to.be.true;
    });

    describe('when using new address form', () => {
      beforeEach(() => {
        // this is real data from staging
        state.user.profile.vet360[FIELD_NAMES.MAILING_ADDRESS] = {
          addressLine1: '36320 Coronado Dr',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Fremont',
          countryName: 'United States',
          countryCodeIso2: 'US',
          countryCodeIso3: 'USA',
          countryCodeFips: null,
          countyCode: '06001',
          countyName: 'Alameda County',
          createdAt: '2019-10-04T17:52:48.000Z',
          effectiveEndDate: null,
          effectiveStartDate: '2020-03-04T18:33:56.000Z',
          id: 104273,
          internationalPostalCode: null,
          province: null,
          sourceDate: '2020-03-04T18:33:56.000Z',
          sourceSystemUser: null,
          stateCode: 'CA',
          transactionId: '17a5fa0c-36be-4ce0-960d-b06d3b297ebe',
          updatedAt: '2020-03-04T18:33:57.000Z',
          validationKey: null,
          vet360Id: '139281',
          zipCode: '94536',
          zipCodeSuffix: '5537',
        };
      });

      it('returns `checked` as `true` when addresses are equal', () => {
        // This is real data from staging
        state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
          value: {
            id: 145184,
            addressLine1: '36320 Coronado Dr',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryName: 'United States',
            stateCode: 'CA',
            zipCode: '94536',
            addressPou: 'RESIDENCE/CHOICE',
          },
        };

        const result = mapStateToProps(state, { useNewAddressForm: true });
        expect(result.checked).to.be.true;
      });

      it('returns `checked` as `false` when addresses are not equal', () => {
        state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
          value: {
            id: 145184,
            addressLine1: '123 Main St.',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryName: 'United States',
            stateCode: 'CA',
            zipCode: '94536',
            addressPou: 'RESIDENCE/CHOICE',
          },
        };

        const result = mapStateToProps(state, { useNewAddressForm: true });
        expect(result.checked).to.be.false;
      });
    });
  });
});
