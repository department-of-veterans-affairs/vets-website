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
      emergencyContacts: [
        {
          fullName: {
            first: 'MARYEDITED',
            middle: 'SIL',
            last: 'MARMSEDITED',
          },
          relationship: 'WIFE',
          contactType: 'Emergency Contact',
          primaryPhone: '6123526123',
          address: {
            street: '8990 RALSTON RD',
            city: 'ARVADA',
            country: 'USA',
            state: 'CO',
            postalCode: '80002',
          },
        },
      ],
      nextOfKins: [
        {
          fullName: {
            first: 'Dave',
            last: 'Guy',
          },
          relationship: 'BROTHER',
          contactType: 'Primary Next of Kin',
          primaryPhone: '7038888888',
          address: {
            street: '25434 ELM TERR',
            city: 'ALDIE',
            country: 'USA',
            state: 'VA',
            postalCode: '20105',
          },
        },
      ],
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
        expect(Object.keys(prefillData)).to.have.lengthOf(12);
        expect(Object.keys(prefillData).veteranAddress).to.not.exist;
        expect(Object.keys(prefillData).veteranHomeAddress).to.not.exist;
        expect(prefillData['view:doesMailingMatchHomeAddress']).to.equal(
          undefined,
        );
        expect(prefillData.emergencyContacts[0].address).to.exist;
        expect(prefillData.nextOfKins[0].address).to.exist;
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
        expect(Object.keys(prefillData)).to.have.lengthOf(13);
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
          expect(Object.keys(prefillData)).to.have.lengthOf(14);
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
          expect(Object.keys(prefillData)).to.have.lengthOf(13);
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
        expect(Object.keys(prefillData)).to.have.lengthOf(12);
      });
    });

    context('when spouse confirmation flow is enabled', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
        featureToggles: {
          ezrSpouseConfirmationFlowEnabled: true,
        },
      };
      const formDataWithSpouse = {
        ...formData,
        maritalStatus: 'married',
        spouseFullName: {
          first: 'Jane',
          last: 'Doe',
        },
        spouseSocialSecurityNumber: '123456789',
        spouseDateOfBirth: '1980-01-01',
        cohabitedLastYear: true,
        dateOfMarriage: '2010-06-15',
        spousePhone: '5551234567',
        provideSupportLastYear: true,
        sameAddress: true,
        spouseAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'ST',
          postalCode: '12345',
          country: 'USA',
        },
      };

      it('should wrap spouse fields in spouseInformation array', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formDataWithSpouse,
          null,
          state,
        );
        expect(prefillData.spouseInformation).to.be.an('array');
        expect(prefillData.spouseInformation).to.have.lengthOf(1);
        // Verify key spouse fields are wrapped correctly
        expect(prefillData.spouseInformation[0].spouseFullName).to.deep.equal({
          first: 'Jane',
          last: 'Doe',
        });
        expect(
          prefillData.spouseInformation[0].spouseSocialSecurityNumber,
        ).to.equal('123456789');
        expect(prefillData.spouseInformation[0].cohabitedLastYear).to.be.true;
        expect(prefillData.spouseInformation[0].dateOfMarriage).to.equal(
          '2010-06-15',
        );
        expect(prefillData.spouseInformation[0].spousePhone).to.equal(
          '5551234567',
        );
      });
    });

    context('when providers and dependents prefill is enabled', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
        featureToggles: {
          ezrProvidersAndDependentsPrefillEnabled: true,
        },
      };
      const formDataWithFinancial = {
        ...formData,
        'view:deductibleMedicalExpenses': {
          deductibleMedicalExpenses: 1200,
        },
        'view:deductibleFuneralExpenses': {
          deductibleFuneralExpenses: 500,
        },
        'view:deductibleEducationExpenses': {
          deductibleEducationExpenses: 3000,
        },
        'view:veteranGrossIncome': {
          veteranGrossIncome: 45000,
        },
        'view:veteranNetIncome': {
          veteranNetIncome: 35000,
        },
        'view:veteranOtherIncome': {
          veteranOtherIncome: 2000,
        },
        'view:spouseGrossIncome': {
          spouseGrossIncome: 25000,
        },
        'view:spouseNetIncome': {
          spouseNetIncome: 20000,
        },
        'view:spouseOtherIncome': {
          spouseOtherIncome: 1000,
        },
      };

      it('should wrap financial fields in financialInformation array', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formDataWithFinancial,
          null,
          state,
        );
        expect(prefillData.financialInformation).to.be.an('array');
        expect(prefillData.financialInformation).to.have.lengthOf(1);
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:deductibleMedicalExpenses',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:deductibleFuneralExpenses',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:deductibleEducationExpenses',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:veteranGrossIncome',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:veteranNetIncome',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:veteranOtherIncome',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:spouseGrossIncome',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:spouseNetIncome',
        );
        expect(prefillData.financialInformation[0]).to.have.property(
          'view:spouseOtherIncome',
        );
        // Verify the wrapped values are correct
        expect(
          prefillData.financialInformation[0]['view:deductibleMedicalExpenses'],
        ).to.deep.equal({
          deductibleMedicalExpenses: 1200,
        });
        expect(
          prefillData.financialInformation[0]['view:veteranGrossIncome'],
        ).to.deep.equal({
          veteranGrossIncome: 45000,
        });
      });
    });

    context('when insurance provider information is prefilled', () => {
      it('wraps provider Policy Numbers and Group Codes into a view group', () => {
        const state = {
          user: {
            profile: {
              vapContactInfo: {},
            },
          },
          featureToggles: {
            ezrProvidersAndDependentsPrefillEnabled: true,
          },
        };
        const formDataWithProviders = {
          ...formData,
          providers: [
            {
              insuranceName: 'Cigna',
              insurancePolicyHolderName: 'John Smith',
              insurancePolicyNumber: '006655',
            },
            {
              insuranceName: 'Aetna',
              insurancePolicyHolderName: 'Mary Smith',
              insuranceGroupCode: '006655',
            },
          ],
        };

        const { formData: prefillData } = prefillTransformer(
          null,
          formDataWithProviders,
          null,
          state,
        );

        const expectedProvider0 = {
          insuranceName: 'Cigna',
          insurancePolicyHolderName: 'John Smith',
          'view:policyOrGroup': {
            insurancePolicyNumber: '006655',
            insuranceGroupCode: undefined,
          },
        };
        const expectedProvider1 = {
          insuranceName: 'Aetna',
          insurancePolicyHolderName: 'Mary Smith',
          'view:policyOrGroup': {
            insurancePolicyNumber: undefined,
            insuranceGroupCode: '006655',
          },
        };
        expect(prefillData.providers[0]).to.deep.equal(expectedProvider0);
        expect(prefillData.providers[1]).to.deep.equal(expectedProvider1);
      });
    });

    context(
      'when both spouse confirmation flow and providers prefill are enabled',
      () => {
        const state = {
          user: {
            profile: {
              vapContactInfo: {},
            },
          },
          featureToggles: {
            ezrSpouseConfirmationFlowEnabled: true,
            ezrProvidersAndDependentsPrefillEnabled: true,
          },
        };
        const formDataWithBoth = {
          ...formData,
          maritalStatus: 'married',
          spouseFullName: {
            first: 'Jane',
            last: 'Doe',
          },
          spouseSocialSecurityNumber: '123456789',
          spouseDateOfBirth: '1980-01-01',
          cohabitedLastYear: true,
          'view:deductibleMedicalExpenses': {
            deductibleMedicalExpenses: 1200,
          },
          'view:veteranGrossIncome': {
            veteranGrossIncome: 45000,
          },
          'view:spouseGrossIncome': {
            spouseGrossIncome: 25000,
          },
        };

        it('should wrap both spouse and financial fields in respective arrays', () => {
          const { formData: prefillData } = prefillTransformer(
            null,
            formDataWithBoth,
            null,
            state,
          );
          expect(prefillData.spouseInformation).to.be.an('array');
          expect(prefillData.spouseInformation).to.have.lengthOf(1);
          expect(prefillData.spouseInformation[0]).to.have.property(
            'spouseFullName',
          );
          expect(prefillData.spouseInformation[0]).to.have.property(
            'spouseSocialSecurityNumber',
          );

          expect(prefillData.financialInformation).to.be.an('array');
          expect(prefillData.financialInformation).to.have.lengthOf(1);
          expect(prefillData.financialInformation[0]).to.have.property(
            'view:deductibleMedicalExpenses',
          );
          expect(prefillData.financialInformation[0]).to.have.property(
            'view:veteranGrossIncome',
          );
          expect(prefillData.financialInformation[0]).to.have.property(
            'view:spouseGrossIncome',
          );
        });
      },
    );

    context('when array builder features are disabled', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
        featureToggles: {
          ezrSpouseConfirmationFlowEnabled: false,
          ezrProvidersAndDependentsPrefillEnabled: false,
        },
      };
      const formDataWithFields = {
        ...formData,
        maritalStatus: 'married',
        spouseFullName: {
          first: 'Jane',
          last: 'Doe',
        },
        spouseSocialSecurityNumber: '123456789',
        'view:deductibleMedicalExpenses': {
          deductibleMedicalExpenses: 1200,
        },
        'view:veteranGrossIncome': {
          veteranGrossIncome: 45000,
        },
      };

      it('should not wrap fields in arrays when features are disabled', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formDataWithFields,
          null,
          state,
        );
        expect(prefillData.spouseInformation).to.be.undefined;
        expect(prefillData.financialInformation).to.be.undefined;
        // Verify flat fields remain flat
        expect(prefillData.spouseFullName).to.deep.equal({
          first: 'Jane',
          last: 'Doe',
        });
        expect(prefillData.spouseSocialSecurityNumber).to.equal('123456789');
        expect(prefillData['view:deductibleMedicalExpenses']).to.deep.equal({
          deductibleMedicalExpenses: 1200,
        });
      });
    });

    context('when using form-based feature flags instead of toggles', () => {
      const state = {
        user: {
          profile: {
            vapContactInfo: {},
          },
        },
        featureToggles: {}, // No feature toggles, relying on form data flags
      };
      const formDataWithFormFlags = {
        ...formData,
        maritalStatus: 'married',
        'view:isSpouseConfirmationFlowEnabled': true,
        'view:isProvidersAndDependentsPrefillEnabled': true,
        spouseFullName: {
          first: 'John',
          last: 'Smith',
        },
        spouseSocialSecurityNumber: '987654321',
        'view:deductibleMedicalExpenses': {
          deductibleMedicalExpenses: 800,
        },
        'view:veteranGrossIncome': {
          veteranGrossIncome: 50000,
        },
      };

      it('should wrap fields using form-based feature flags', () => {
        const { formData: prefillData } = prefillTransformer(
          null,
          formDataWithFormFlags,
          null,
          state,
        );
        expect(prefillData.spouseInformation).to.be.an('array');
        expect(prefillData.spouseInformation).to.have.lengthOf(1);
        expect(prefillData.spouseInformation[0].spouseFullName).to.deep.equal({
          first: 'John',
          last: 'Smith',
        });

        expect(prefillData.financialInformation).to.be.an('array');
        expect(prefillData.financialInformation).to.have.lengthOf(1);
        expect(
          prefillData.financialInformation[0]['view:deductibleMedicalExpenses'],
        ).to.deep.equal({
          deductibleMedicalExpenses: 800,
        });
      });
    });
  });
});
