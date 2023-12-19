import { expect } from 'chai';
import omit from 'platform/utilities/data/omit';
import {
  sanitizeAddress,
  prefillTransformer,
} from '../../../../utils/helpers/prefill-transformer';

describe('ezr prefill transformer', () => {
  context('when `sanitizeAddress` executes', () => {
    it('should return all required fields when provided', () => {
      const addressToSanitize = {
        addressLine1: '123 Apple Lane',
        city: 'Plymouth',
        zipCode: '46563',
        stateCode: 'IN',
        countryCodeIso3: 'USA',
      };
      const desiredOutput = JSON.stringify({
        isMilitary: false,
        street: '123 Apple Lane',
        street2: undefined,
        street3: undefined,
        city: 'Plymouth',
        postalCode: '46563',
        state: 'IN',
        country: 'USA',
      });
      const output = JSON.stringify(sanitizeAddress(addressToSanitize));
      expect(output).to.equal(desiredOutput);
    });

    it('should return all fields when provided', () => {
      const addressToSanitize = {
        addressLine1: '123 Apple Lane',
        addressLine2: 'Apt 1',
        addressLine3: 'c/o homeowner',
        city: 'Plymouth',
        zipCode: '46563',
        stateCode: 'IN',
        countryCodeIso3: 'USA',
      };
      const desiredOutput = JSON.stringify({
        isMilitary: false,
        street: '123 Apple Lane',
        street2: 'Apt 1',
        street3: 'c/o homeowner',
        city: 'Plymouth',
        postalCode: '46563',
        state: 'IN',
        country: 'USA',
      });
      const output = JSON.stringify(sanitizeAddress(addressToSanitize));
      expect(output).to.equal(desiredOutput);
    });

    it('should set `isMilitary` to true when a military city code is provided', () => {
      const addressToSanitize = {
        addressLine1: 'PSC 808 Box 37',
        city: 'FPO',
        zipCode: '09618',
        stateCode: 'AA',
        countryCodeIso3: 'USA',
      };
      const desiredOutput = JSON.stringify({
        isMilitary: true,
        street: 'PSC 808 Box 37',
        city: 'FPO',
        postalCode: '09618',
        state: 'AA',
        country: 'USA',
      });
      const output = JSON.stringify(sanitizeAddress(addressToSanitize));
      expect(output).to.equal(desiredOutput);
    });

    it('should return `null` with with no props', () => {
      expect(sanitizeAddress()).to.be.null;
    });
  });

  context('when `prefillTransformer` executes', () => {
    const formData = {
      veteranFullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
      gender: 'M',
      veteranDateOfBirth: '1933-05-04',
      veteranSocialSecurityNumber: '796121200',
      homePhone: '4445551212',
      email: 'test2@test1.net',
      isMedicaidEligible: false,
      isEnrolledMedicarePartA: false,
      maritalStatus: 'never married',
    };

    context('when profile data omits all addresses', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
      };

      it('should auto-fill correct formData from user state', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formData,
          null,
          state,
        );
        expect(Object.keys(prefillData)).to.have.lengthOf(9);
        expect(Object.keys(prefillData).veteranAddress).to.not.exist;
        expect(Object.keys(prefillData).veteranHomeAddress).to.not.exist;
        expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(
          undefined,
        );
      });
    });

    context('when profile data omits mailing address', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {
              residentialAddress: {
                addressLine1: 'PSC 808 Box 37',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'RESIDENCE/CHOICE',
                addressType: 'OVERSEAS MILITARY',
                city: 'FPO',
                countryCodeFips: 'US',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryName: 'United States',
                createdAt: '2018-04-21T20:09:50Z',
                effectiveEndDate: '2018-04-21T20:09:50Z',
                effectiveStartDate: '2018-04-21T20:09:50Z',
                id: 124,
                internationalPostalCode: '54321',
                latitude: 37.5615,
                longitude: -121.9988,
                province: 'string',
                sourceDate: '2018-04-21T20:09:50Z',
                stateCode: 'AE',
                updatedAt: '2018-04-21T20:09:50Z',
                zipCode: '09618',
                zipCodeSuffix: '1234',
              },
            },
          },
        },
      };

      it('should auto-fill correct formData from user state', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formData,
          null,
          state,
        );
        expect(Object.keys(prefillData)).to.have.lengthOf(10);
        expect(prefillData.veteranAddress).to.equal(undefined);
        expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(8);
        expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(
          undefined,
        );
      });
    });

    context(
      'when profile data includes mailing address that does not match residential address',
      () => {
        const state = {
          user: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  addressLine1: 'PSC 808 Box 37',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'RESIDENCE/CHOICE',
                  addressType: 'OVERSEAS MILITARY',
                  city: 'FPO',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  countryName: 'United States',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  id: 124,
                  internationalPostalCode: '54321',
                  latitude: 37.5615,
                  longitude: -121.9988,
                  province: 'string',
                  sourceDate: '2018-04-21T20:09:50Z',
                  stateCode: 'AE',
                  updatedAt: '2018-04-21T20:09:50Z',
                  zipCode: '09618',
                  zipCodeSuffix: '1234',
                },
                mailingAddress: {
                  addressLine1: '1493 Martin Luther King Rd',
                  addressLine2: 'Apt 1',
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  addressType: 'DOMESTIC',
                  city: 'Fulton',
                  countryName: 'United States',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
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
                  zipCodeSuffix: '1234',
                },
              },
            },
          },
        };

        it('should auto-fill correct formData from user state', () => {
          const { formData: prefillData } = prefillTransformer(
            null,
            formData,
            null,
            state,
          );
          expect(Object.keys(prefillData)).to.have.lengthOf(11);
          expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(8);
          expect(Object.keys(prefillData.veteranHomeAddress)).to.have.lengthOf(
            8,
          );
          expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.false;
        });
      },
    );

    context(
      'when profile data includes mailing address that matches residential address',
      () => {
        const state = {
          user: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  addressLine1: '1493 Martin Luther King Rd',
                  addressLine2: 'Apt 1',
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  addressType: 'DOMESTIC',
                  city: 'Fulton',
                  countryName: 'United States',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  id: 123,
                  internationalPostalCode: '54321',
                  latitude: 37.5615,
                  longitude: -121.9988,
                  province: 'string',
                  sourceDate: '2018-04-21T20:09:50Z',
                  stateCode: 'NY',
                  updatedAt: '2018-04-21T20:09:50Z',
                  zipCode: '97062',
                  zipCodeSuffix: '1234',
                },
                mailingAddress: {
                  addressLine1: '1493 Martin Luther King Rd',
                  addressLine2: 'Apt 1',
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  addressType: 'DOMESTIC',
                  city: 'Fulton',
                  countryName: 'United States',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
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
                  zipCodeSuffix: '1234',
                },
              },
            },
          },
        };

        it('should auto-fill correct formData from user state', () => {
          const { formData: prefillData } = prefillTransformer(
            null,
            formData,
            null,
            state,
          );
          expect(Object.keys(prefillData)).to.have.lengthOf(10);
          expect(Object.keys(prefillData).veteranHomeAddress).to.not.exist;
          expect(Object.keys(prefillData.veteranAddress)).to.have.lengthOf(8);
          expect(prefillData['view:doesMailingMatchHomeAddress']).to.be.true;
        });
      },
    );

    context('when viewfield data is omitted', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
      };
      const withoutViewFields = omit(
        [
          'email',
          'homePhone',
          'maritalStatus',
          'isMedicaidEligible',
          'isEnrolledMedicarePartA',
        ],
        formData,
      );

      it('should auto-fill correct formData from user state', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          withoutViewFields,
          null,
          state,
        );
        expect(Object.keys(prefillData)).to.have.lengthOf(9);
      });
    });
  });
});
