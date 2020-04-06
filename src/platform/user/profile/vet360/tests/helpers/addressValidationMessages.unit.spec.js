import {
  getValidationMessageKey,
  showAddressValidationModal,
} from '../../../utilities';

describe('getValidationMessageKey', () => {
  test('returns showSuggestionsOverride key', () => {
    const addressValidationError = false;
    const validationKey = 12345;
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
    const confirmedAddresses = [];
    expect(
      getValidationMessageKey(
        suggestedAddresses,
        validationKey,
        addressValidationError,
        confirmedAddresses,
      ),
    ).toBe('showSuggestionsOverride');
  });

  test('returns missingUnitNumberOverride key', () => {
    const addressValidationError = false;
    const validationKey = 12345;
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
      getValidationMessageKey(
        suggestedAddresses,
        validationKey,
        addressValidationError,
      ),
    ).toBe('missingUnitNumberOverride');
  });
});

describe('showAddressValidationModal', () => {
  test('returns true with multiple suggestions', () => {
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
    expect(showAddressValidationModal(suggestedAddresses)).toBe(true);
  });

  test("returns false with single CONFIRMED suggestion that's over 90 confidence score", () => {
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
          confidenceScore: 91.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
        },
      },
    ];
    expect(showAddressValidationModal(suggestedAddresses)).toBe(false);
  });

  test("returns true with single deliverable suggestion that's under 90 confidence", () => {
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
          confidenceScore: 87.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'CONFIRMED',
        },
      },
    ];
    expect(showAddressValidationModal(suggestedAddresses)).toBe(true);
  });

  test('returns true with single suggestion over 90 confidence but undeliverable', () => {
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
          confidenceScore: 91.0,
          addressType: 'Domestic',
          deliveryPointValidation: 'UNDELIVERABLE',
        },
      },
    ];
    expect(showAddressValidationModal(suggestedAddresses)).toBe(true);
  });
});
