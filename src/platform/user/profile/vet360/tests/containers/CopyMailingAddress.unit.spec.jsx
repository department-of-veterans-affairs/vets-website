import { expect } from 'chai';

import { FIELD_NAMES } from '../../constants';

import { mapStateToProps } from '../../containers/CopyMailingAddress';

import { convertNextValueToCleanData } from '../../components/AddressField';

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
  });
});
