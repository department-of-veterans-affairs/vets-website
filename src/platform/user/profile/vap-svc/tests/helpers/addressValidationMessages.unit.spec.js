import { expect } from 'chai';
import {
  getValidationMessageKey,
  showAddressValidationModal,
} from 'platform/user/profile/vap-svc/util';
import { ADDRESS_VALIDATION_TYPES } from '../../constants/addressValidationMessages';

describe('getValidationMessageKey', () => {
  it('returns showSuggestionsOverride key', () => {
    const suggestedAddresses = [
      {
        address: {
          addressLine1: '400 N 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98103',
          zipCodeSuffix: '5252',
        },
        addressMetaData: {
          confidenceScore: 79.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'UNDELIVERABLE',
        },
      },
      {
        address: {
          addressLine1: '400 NE 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98115',
          zipCodeSuffix: '6463',
        },
        addressMetaData: {
          confidenceScore: 98.0,
          addressType: 'Domestic',
          deliveryPointValidation:
            'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
          residentialDeliveryIndicator: 'RESIDENTIAL',
        },
      },
    ];
    expect(
      getValidationMessageKey({
        suggestedAddresses,
        addressValidationError: false,
        confirmedSuggestions: [],
      }),
    ).to.equal('showSuggestionsOverride');
  });

  it('returns missingUnitNumberOverride key', () => {
    const suggestedAddresses = [
      {
        address: {
          addressLine1: '400 NE 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98115',
          zipCodeSuffix: '6463',
        },
        addressMetaData: {
          confidenceScore: 98.0,
          addressType: 'Domestic',
          deliveryPointValidation:
            'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
          residentialDeliveryIndicator: 'RESIDENTIAL',
        },
      },
    ];
    expect(
      getValidationMessageKey({
        suggestedAddresses,
        addressValidationError: false,
      }),
    ).to.equal('missingUnitNumberOverride');
  });

  it('returns validationError key', () => {
    const suggestedAddresses = [
      {
        address: {
          addressLine1: '400 NE 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98115',
          zipCodeSuffix: '6463',
        },
        addressMetaData: {
          confidenceScore: 98.0,
          addressType: 'Domestic',
          deliveryPointValidation:
            'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
          residentialDeliveryIndicator: 'RESIDENTIAL',
        },
      },
    ];
    expect(
      getValidationMessageKey({
        suggestedAddresses,
        addressValidationError: true,
      }),
    ).to.equal(ADDRESS_VALIDATION_TYPES.VALIDATION_ERROR);
  });
});

describe('showAddressValidationModal', () => {
  it('returns true with multiple suggestions', () => {
    const suggestedAddresses = [
      {
        addressLine1: '400 N 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WA',
        zipCode: '98103',
        zipCodeSuffix: '5252',
        addressMetaData: {
          confidenceScore: 79.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'UNDELIVERABLE',
        },
      },
      {
        addressLine1: '400 NE 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WA',
        zipCode: '98115',
        zipCodeSuffix: '6463',
        addressMetaData: {
          confidenceScore: 98.0,
          addressType: 'Domestic',
          deliveryPointValidation:
            'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
          residentialDeliveryIndicator: 'RESIDENTIAL',
        },
      },
    ];
    const userInputAddress = {
      addressLine1: '400 north 65th',
      addressType: 'DOMESTIC',
      city: 'Seattle',
      countryName: 'USA',
      countryCodeIso3: 'USA',
      countyCode: '53033',
      countyName: 'King',
      stateCode: 'WA',
      zipCode: '98103',
      zipCodeSuffix: '5252',
    };
    expect(
      showAddressValidationModal(suggestedAddresses, userInputAddress),
    ).to.equal(true);
  });

  it('returns false when there is a single CONFIRMED domestic address with a confidence score > 90 and whose state matches the user-submitted state', () => {
    const suggestedAddresses = [
      {
        addressLine1: '400 N 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WA',
        zipCode: '98103',
        zipCodeSuffix: '5252',
        addressMetaData: {
          confidenceScore: 91.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
        },
      },
    ];
    const userInputAddress = {
      addressLine1: '400 north 65th',
      addressType: 'DOMESTIC',
      city: 'Seattle',
      countryName: 'USA',
      countryCodeIso3: 'USA',
      countyCode: '53033',
      countyName: 'King',
      stateCode: 'WA',
      zipCode: '98103',
      zipCodeSuffix: '5252',
    };
    expect(
      showAddressValidationModal(suggestedAddresses, userInputAddress),
    ).to.equal(false);
  });

  it('returns true when there is a single CONFIRMED domestic address with a confidence score > 90 but whose state does not match the user-submitted state', () => {
    const suggestedAddresses = [
      {
        addressLine1: '400 N 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WI',
        zipCode: '98103',
        zipCodeSuffix: '5252',
        addressMetaData: {
          confidenceScore: 91.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
        },
      },
    ];
    const userInputAddress = {
      addressLine1: '400 north 65th',
      addressType: 'DOMESTIC',
      city: 'Seattle',
      countryName: 'USA',
      countryCodeIso3: 'USA',
      countyCode: '53033',
      countyName: 'King',
      stateCode: 'WA',
      zipCode: '98103',
      zipCodeSuffix: '5252',
    };
    expect(
      showAddressValidationModal(suggestedAddresses, userInputAddress),
    ).to.equal(true);
  });

  it("returns true with single deliverable suggestion that's under 90 confidence", () => {
    const suggestedAddresses = [
      {
        addressLine1: '400 N 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WA',
        zipCode: '98103',
        zipCodeSuffix: '5252',
        addressMetaData: {
          confidenceScore: 87.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
        },
      },
    ];
    const userInputAddress = {
      addressLine1: '400 north 65th',
      addressType: 'DOMESTIC',
      city: 'Seattle',
      countryName: 'USA',
      countryCodeIso3: 'USA',
      countyCode: '53033',
      countyName: 'King',
      stateCode: 'WA',
      zipCode: '98103',
      zipCodeSuffix: '5252',
    };
    expect(
      showAddressValidationModal(suggestedAddresses, userInputAddress),
    ).to.equal(true);
  });

  it('returns true with single suggestion over 90 confidence but undeliverable', () => {
    const suggestedAddresses = [
      {
        addressLine1: '400 N 65th St',
        addressType: 'DOMESTIC',
        city: 'Seattle',
        countryName: 'USA',
        countryCodeIso3: 'USA',
        countyCode: '53033',
        countyName: 'King',
        stateCode: 'WA',
        zipCode: '98103',
        zipCodeSuffix: '5252',
        addressMetaData: {
          confidenceScore: 91.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'UNDELIVERABLE',
        },
      },
    ];
    const userInputAddress = {
      addressLine1: '400 north 65th',
      addressType: 'DOMESTIC',
      city: 'Seattle',
      countryName: 'USA',
      countryCodeIso3: 'USA',
      countyCode: '53033',
      countyName: 'King',
      stateCode: 'WA',
      zipCode: '98103',
      zipCodeSuffix: '5252',
    };
    expect(
      showAddressValidationModal(suggestedAddresses, userInputAddress),
    ).to.equal(true);
  });
});
