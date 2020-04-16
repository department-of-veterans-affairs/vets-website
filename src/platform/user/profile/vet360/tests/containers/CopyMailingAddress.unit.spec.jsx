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

    describe('checked prop', () => {
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

      it('is `true` when addresses are equal', () => {
        // This is real data from staging
        state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
          value: {
            id: 145184,
            addressLine1: '36320 Coronado Dr',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryCodeIso3: 'USA',
            stateCode: 'CA',
            zipCode: '94536',
            addressPou: 'RESIDENCE/CHOICE',
          },
        };

        const result = mapStateToProps(state, { useNewAddressForm: true });
        expect(result.checked).to.be.true;
      });

      it('is `false` when addresses are not equal', () => {
        state.vet360.formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS] = {
          value: {
            id: 145184,
            addressLine1: '123 Main St.',
            addressType: 'DOMESTIC',
            city: 'Fremont',
            countryCodeIso3: 'USA',
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
