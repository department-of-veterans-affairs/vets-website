import { expect } from 'chai';
import MockDate from 'mockdate';
import { TRIP_TYPES } from '../../constants';

import {
  DATE_VALIDATION_TYPE,
  parseDateInput,
  validateReceiptDate,
  validateDescription,
  validateRequestedAmount,
  validateAirTravelFields,
  validateCommonCarrierFields,
  validateLodgingFields,
  validateMealFields,
} from '../../util/expense-validation-helpers';

const getFutureDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

describe('parseDateInput', () => {
  it('returns null values when input is falsy', () => {
    expect(parseDateInput(null)).to.deep.equal({
      month: null,
      day: null,
      year: null,
    });
  });

  it('parses YYYY-MM-DD string correctly', () => {
    const result = parseDateInput('2025-01-04');

    expect(result).to.deep.equal({
      month: '01',
      day: '04',
      year: '2025',
    });
  });

  it('trims object input values', () => {
    const result = parseDateInput({
      month: ' 2 ',
      day: ' 5 ',
      year: ' 2024 ',
    });

    expect(result).to.deep.equal({
      month: '2',
      day: '5',
      year: '2024',
    });
  });

  it('returns null for empty object fields', () => {
    const result = parseDateInput({
      month: '',
      day: '',
      year: '',
    });

    expect(result).to.deep.equal({
      month: null,
      day: null,
      year: null,
    });
  });
});

describe('validateReceiptDate', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('shows required error on SUBMIT when date is empty', () => {
    const result = validateReceiptDate(null, DATE_VALIDATION_TYPE.SUBMIT);

    expect(result.isValid).to.be.false;
    expect(result.purchaseDate).to.equal('Enter the date on your receipt');
  });

  it('does not show required error on CHANGE', () => {
    const result = validateReceiptDate(null, DATE_VALIDATION_TYPE.CHANGE);

    expect(result.isValid).to.be.true;
    expect(result.purchaseDate).to.be.null;
  });

  it('shows error for incomplete date', () => {
    const result = validateReceiptDate(
      { month: '1', day: null, year: null },
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(result.isValid).to.be.false;
    expect(result.purchaseDate).to.equal('Please enter a complete date');
  });

  it('shows future date error when date is in the future', () => {
    MockDate.set('2025-01-01T00:00:00Z');

    const result = validateReceiptDate(
      { month: '12', day: '31', year: '2025' },
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(result.isValid).to.be.false;
    expect(result.purchaseDate).to.equal("Don't enter a future date");
  });

  it('passes for a valid past date', () => {
    MockDate.set('2025-01-10T00:00:00Z');

    const result = validateReceiptDate(
      '2025-01-01',
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(result.isValid).to.be.true;
    expect(result.purchaseDate).to.be.null;
  });

  it('shows incomplete date error on CHANGE validation type', () => {
    const result = validateReceiptDate(
      { month: '2', day: null, year: '2025' },
      DATE_VALIDATION_TYPE.CHANGE,
    );

    expect(result.isValid).to.be.false;
    expect(result.purchaseDate).to.equal('Please enter a complete date');
  });

  it('shows incomplete date error on BLUR validation type', () => {
    const result = validateReceiptDate(
      { month: '2', day: null, year: '2025' },
      DATE_VALIDATION_TYPE.BLUR,
    );

    expect(result.isValid).to.be.false;
    expect(result.purchaseDate).to.equal('Please enter a complete date');
  });
});

describe('validateDescription', () => {
  it('shows required error on SUBMIT when empty', () => {
    const result = validateDescription('', DATE_VALIDATION_TYPE.SUBMIT);

    expect(result.isValid).to.be.false;
    expect(result.description).to.equal('Enter a description');
  });

  it('shows min length error when too short', () => {
    const result = validateDescription('abc', DATE_VALIDATION_TYPE.BLUR);

    expect(result.isValid).to.be.false;
    expect(result.description).to.equal('Enter at least 5 characters');
  });

  it('shows max length error when too long', () => {
    const longText = 'a'.repeat(2001);

    const result = validateDescription(longText, DATE_VALIDATION_TYPE.CHANGE);

    expect(result.isValid).to.be.false;
    expect(result.description).to.equal('Enter no more than 2,000 characters');
  });

  it('passes for valid description', () => {
    const result = validateDescription(
      'Valid description',
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(result.isValid).to.be.true;
    expect(result.description).to.be.null;
  });
});

describe('validateRequestedAmount', () => {
  it('shows required error on SUBMIT when empty', () => {
    const result = validateRequestedAmount('', DATE_VALIDATION_TYPE.SUBMIT);

    expect(result.isValid).to.be.false;
    expect(result.errors.costRequested).to.equal('Enter an amount');
  });

  it('rejects non-numeric input', () => {
    const result = validateRequestedAmount('abc', DATE_VALIDATION_TYPE.BLUR);

    expect(result.isValid).to.be.false;
    expect(result.errors.costRequested).to.equal('Enter an amount in numbers');
  });

  it('rejects more than 2 decimal places', () => {
    const result = validateRequestedAmount('1.234', DATE_VALIDATION_TYPE.BLUR);

    expect(result.isValid).to.be.false;
    expect(result.errors.costRequested).to.equal(
      'Enter an amount using this format: x.xx',
    );
  });

  it('rejects zero or negative amounts', () => {
    const result = validateRequestedAmount('0', DATE_VALIDATION_TYPE.BLUR);

    expect(result.isValid).to.be.false;
    expect(result.errors.costRequested).to.equal(
      'Enter an amount greater than 0',
    );
  });

  it('auto-formats amount to 2 decimals on BLUR', () => {
    const result = validateRequestedAmount('2.5', DATE_VALIDATION_TYPE.BLUR);

    expect(result.isValid).to.be.true;
    expect(result.formattedValue).to.equal('2.50');
    expect(result.errors.costRequested).to.be.null;
  });

  it('passes for valid amount without formatting on CHANGE', () => {
    const result = validateRequestedAmount(
      '10.25',
      DATE_VALIDATION_TYPE.CHANGE,
    );

    expect(result.isValid).to.be.true;
    expect(result.formattedValue).to.be.null;
    expect(result.errors.costRequested).to.be.null;
  });
});

describe('validateAirTravelFields', () => {
  let formState;

  beforeEach(() => {
    formState = {
      vendorName: '',
      tripType: '',
      departureDate: '',
      returnDate: '',
      departedFrom: '',
      arrivedTo: '',
    };
  });

  it('validates all fields at once and sets errors for empty values', () => {
    const nextErrors = validateAirTravelFields(formState);
    expect(nextErrors).to.deep.equal({
      vendorName: 'Enter the company name',
      tripType: 'Select a trip type',
      departureDate: 'Enter a departure date',
      returnDate: null,
      departedFrom: 'Enter the airport name',
      arrivedTo: 'Enter the airport name',
    });
  });

  it('validates a single field and leaves others untouched', () => {
    formState.vendorName = 'Acme Airlines';
    const nextErrors = validateAirTravelFields(formState, 'vendorName');

    expect(nextErrors.vendorName).to.equal(null);
  });

  it('throws error when departureDate is after returnDate and both are complete', () => {
    const nextErrors = validateAirTravelFields(
      {
        departureDate: '2025-01-15',
        returnDate: '2025-01-10',
        tripType: TRIP_TYPES.ROUND_TRIP.value,
      },
      'departureDate',
    );

    expect(nextErrors.departureDate).to.equal(
      'Departure date must be before return date',
    );

    expect(nextErrors.returnDate).to.equal(
      'Return date must be later than departure date',
    );
  });

  it('passes when dates are valid', () => {
    formState = {
      vendorName: 'Acme Airlines',
      tripType: TRIP_TYPES.ROUND_TRIP.value,
      departureDate: '2025-01-05',
      returnDate: '2025-01-10',
      departedFrom: 'JFK',
      arrivedTo: 'LAX',
    };

    const nextErrors = validateAirTravelFields(formState);

    // All fields should return null for valid values
    expect(nextErrors.vendorName).to.equal(null);
    expect(nextErrors.tripType).to.equal(null);
    expect(nextErrors.departureDate).to.equal(null);
    expect(nextErrors.returnDate).to.equal(null);
    expect(nextErrors.departedFrom).to.equal(null);
    expect(nextErrors.arrivedTo).to.equal(null);
  });

  it('requires returnDate for ROUND_TRIP', () => {
    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-05';
    formState.returnDate = '';

    const nextErrors = validateAirTravelFields(formState);
    expect(nextErrors.returnDate).to.equal('Enter a return date');
  });

  it('does not require returnDate for ONE_WAY', () => {
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = '';

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(null);
  });

  it('errors if returnDate is entered for ONE_WAY trip', () => {
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    formState.returnDate = '2025-01-10';
    formState.departureDate = '2025-01-05';

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(
      'You entered a return date for a one-way trip',
    );
    expect(nextErrors.tripType).to.equal(
      'You entered a return date for a one-way trip',
    );
  });

  it('validates departureDate only if returnDate exists', () => {
    formState.departureDate = '2025-01-05';
    formState.returnDate = ''; // empty, so no comparison error

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.departureDate).to.equal(null);
  });

  it('validates returnDate only if departureDate exists', () => {
    formState.returnDate = '2025-01-10';
    formState.departureDate = ''; // empty, so no comparison error

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(null);
  });

  it('errors if departureDate is in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const futureDate = tomorrow.toISOString().split('T')[0];

    formState.departureDate = futureDate;

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.departureDate).to.equal("Don't enter a future date");
  });

  it('errors if returnDate is in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const futureDate = tomorrow.toISOString().split('T')[0];

    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-05';
    formState.returnDate = futureDate;

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal("Don't enter a future date");
  });

  it('future departureDate error takes priority over date ordering error', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const futureDate = tomorrow.toISOString().split('T')[0];

    formState.departureDate = futureDate;
    formState.returnDate = '2025-01-01';

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.departureDate).to.equal("Don't enter a future date");
  });

  it('future returnDate error takes priority over date ordering error', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const futureDate = tomorrow.toISOString().split('T')[0];

    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = futureDate;

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal("Don't enter a future date");
  });

  it('clears returnDate error when switching from ROUND_TRIP to ONE_WAY', () => {
    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = '2025-01-10';

    let nextErrors = validateAirTravelFields(formState);
    expect(nextErrors.returnDate).to.equal(null);

    // Switch trip type to ONE_WAY
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    nextErrors = validateAirTravelFields(formState);

    // Error should appear because returnDate is present
    expect(nextErrors.returnDate).to.equal(
      'You entered a return date for a one-way trip',
    );
  });

  it('requires returnDate when switching from ONE_WAY to ROUND_TRIP', () => {
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = ''; // no return date

    let nextErrors = validateAirTravelFields(formState);
    expect(nextErrors.returnDate).to.equal(null);

    // Switch trip type to ROUND_TRIP
    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal('Enter a return date');
  });

  it('shows errors on both tripType and returnDate for ONE_WAY with returnDate', () => {
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    formState.returnDate = '2025-01-10';
    formState.departureDate = '2025-01-05';

    const nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(
      'You entered a return date for a one-way trip',
    );
    expect(nextErrors.tripType).to.equal(
      'You entered a return date for a one-way trip',
    );
  });

  it('revalidates returnDate when tripType changes and returnDate is empty', () => {
    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = '';

    let nextErrors = validateAirTravelFields(formState);
    expect(nextErrors.returnDate).to.equal('Enter a return date');

    // Change tripType to ONE_WAY
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(null);
  });

  it('revalidates returnDate when tripType changes and returnDate exists', () => {
    formState.tripType = TRIP_TYPES.ROUND_TRIP.value;
    formState.departureDate = '2025-01-01';
    formState.returnDate = '2025-01-02';

    let nextErrors = validateAirTravelFields(formState);
    expect(nextErrors.returnDate).to.equal(null);

    // Change tripType to ONE_WAY
    formState.tripType = TRIP_TYPES.ONE_WAY.value;
    nextErrors = validateAirTravelFields(formState);

    expect(nextErrors.returnDate).to.equal(
      'You entered a return date for a one-way trip',
    );
  });

  describe('validateAirTravelFields - same-day ROUND_TRIP handling', () => {
    beforeEach(() => {
      formState = {
        vendorName: 'Acme Airlines',
        tripType: TRIP_TYPES.ROUND_TRIP.value,
        departureDate: '',
        returnDate: '',
        departedFrom: 'JFK',
        arrivedTo: 'LAX',
      };
    });

    it('passes when dates are ISO datetimes and departureDate === returnDate for ROUND_TRIP', () => {
      formState.departureDate = '2025-01-05T00:00:00.000Z';
      formState.returnDate = '2025-01-05T23:59:59.000Z';

      const nextErrors = validateAirTravelFields(formState);

      expect(nextErrors.departureDate).to.equal(null);
      expect(nextErrors.returnDate).to.equal(null);
    });

    it('passes when departureDate === returnDate for ROUND_TRIP', () => {
      formState.departureDate = '2025-01-05';
      formState.returnDate = '2025-01-05';

      const nextErrors = validateAirTravelFields(formState);

      expect(nextErrors.departureDate).to.equal(null);
      expect(nextErrors.returnDate).to.equal(null);
    });

    it('fails when departureDate > returnDate', () => {
      formState.departureDate = '2025-01-06';
      formState.returnDate = '2025-01-05';

      const nextErrors = validateAirTravelFields(formState);

      expect(nextErrors.departureDate).to.equal(
        'Departure date must be before return date',
      );
      expect(nextErrors.returnDate).to.equal(
        'Return date must be later than departure date',
      );
    });

    it('still fails if departureDate === returnDate but tripType is ONE_WAY and returnDate exists', () => {
      formState.tripType = TRIP_TYPES.ONE_WAY.value;
      formState.departureDate = '2025-01-05';
      formState.returnDate = '2025-01-05';

      const nextErrors = validateAirTravelFields(formState);

      expect(nextErrors.returnDate).to.equal(
        'You entered a return date for a one-way trip',
      );
      expect(nextErrors.tripType).to.equal(
        'You entered a return date for a one-way trip',
      );
    });

    it('passes when returnDate is empty for ONE_WAY', () => {
      formState.tripType = TRIP_TYPES.ONE_WAY.value;
      formState.departureDate = '2025-01-05';
      formState.returnDate = '';

      const nextErrors = validateAirTravelFields(formState);

      expect(nextErrors.returnDate).to.equal(null);
    });
  });
});

describe('validateCommonCarrierFields', () => {
  let formState;

  beforeEach(() => {
    formState = {
      carrierType: '',
      reasonNotUsingPOV: '',
    };
  });

  it('sets errors when fields are empty', () => {
    const nextErrors = validateCommonCarrierFields(formState);

    expect(nextErrors).to.deep.equal({
      carrierType: 'Select a transportation type',
      reasonNotUsingPOV: 'Select a reason',
    });
  });

  it('clears errors when fields are filled', () => {
    formState = {
      carrierType: 'Bus',
      reasonNotUsingPOV: 'No personal vehicle',
    };
    const nextErrors = validateCommonCarrierFields(formState);

    expect(nextErrors.carrierType).to.equal(null);
    expect(nextErrors.reasonNotUsingPOV).to.equal(null);
  });

  it('validates a single field only', () => {
    formState.carrierType = 'Train';
    const nextErrors = validateCommonCarrierFields(formState, 'carrierType');

    expect(nextErrors.carrierType).to.equal(null);
    expect(nextErrors.reasonNotUsingPOV).to.be.undefined; // not validated
  });
});

describe('validateLodgingFields', () => {
  let formState;

  beforeEach(() => {
    formState = {
      vendor: '',
      checkInDate: '',
      checkOutDate: '',
    };
  });

  it('validates all fields at once and sets errors for empty values', () => {
    const nextErrors = validateLodgingFields(formState);

    expect(nextErrors).to.deep.equal({
      vendor: 'Enter the name on your receipt',
      checkInDate: 'Enter the date you checked in',
      checkOutDate: 'Enter the date you checked out',
    });
  });

  it('validates a single field (vendor) and leaves others untouched', () => {
    formState.vendor = 'Hotel California';
    const nextErrors = validateLodgingFields(formState, 'vendor');

    expect(nextErrors.vendor).to.equal(null);
    expect(nextErrors.checkInDate).to.be.undefined;
    expect(nextErrors.checkOutDate).to.be.undefined;
  });

  it('does not throw ordering error when checkInDate is incomplete', () => {
    const nextErrors = validateLodgingFields(
      {
        checkInDate: '2025-01',
        checkOutDate: '2025-01-10',
      },
      'checkInDate',
    );

    expect(nextErrors.checkInDate).to.equal(null);
  });

  it('does not throw ordering error when checkOutDate is incomplete', () => {
    const nextErrors = validateLodgingFields(
      {
        checkInDate: '2025-01-10',
        checkOutDate: '2025-01',
      },
      'checkOutDate',
    );

    expect(nextErrors.checkOutDate).to.equal(null);
  });

  it('requires checkInDate if empty', () => {
    formState.checkOutDate = '2025-01-10';
    const nextErrors = validateLodgingFields(formState, 'checkInDate');

    expect(nextErrors.checkInDate).to.equal('Enter the date you checked in');
  });

  it('requires checkOutDate if empty', () => {
    formState.checkInDate = '2025-01-05';
    const nextErrors = validateLodgingFields(formState, 'checkOutDate');

    expect(nextErrors.checkOutDate).to.equal('Enter the date you checked out');
  });

  it('flags error if checkInDate >= checkOutDate and both dates are complete', () => {
    const nextErrors = validateLodgingFields(
      {
        checkInDate: '2025-01-10',
        checkOutDate: '2025-01-05',
      },
      'checkInDate',
    );

    expect(nextErrors.checkOutDate).to.equal(
      'Check-out date must be later than check-in date',
    );
    expect(nextErrors.checkInDate).to.equal(
      'Check-in date must be earlier than check-out date',
    );
  });

  it('passes when checkInDate < checkOutDate', () => {
    formState.vendor = 'Hotel California';
    formState.checkInDate = '2025-01-05';
    formState.checkOutDate = '2025-01-10';

    const nextErrors = validateLodgingFields(formState);

    expect(nextErrors.vendor).to.equal(null);
    expect(nextErrors.checkInDate).to.equal(null);
    expect(nextErrors.checkOutDate).to.equal(null);
  });

  it('flags error if checkInDate is in the future', () => {
    formState.checkInDate = getFutureDateString();
    formState.checkOutDate = '2025-01-10';

    const nextErrors = validateLodgingFields(formState);

    expect(nextErrors.checkInDate).to.equal("Don't enter a future date");
  });

  it('flags error if checkOutDate is in the future', () => {
    formState.checkInDate = '2025-01-05';
    formState.checkOutDate = getFutureDateString();

    const nextErrors = validateLodgingFields(formState);

    expect(nextErrors.checkOutDate).to.equal("Don't enter a future date");
  });

  it('allows ordering error on checkOutDate even when checkInDate is future', () => {
    const futureDate = getFutureDateString();

    const nextErrors = validateLodgingFields({
      checkInDate: futureDate,
      checkOutDate: '2025-01-01',
    });

    expect(nextErrors.checkInDate).to.equal("Don't enter a future date");
    expect(nextErrors.checkOutDate).to.equal(
      'Check-out date must be later than check-in date',
    );
  });
});

describe('validateMealFields', () => {
  let formState;
  let errors;

  beforeEach(() => {
    formState = { vendorName: '' };
    errors = {};
  });

  it('validates all fields at once and sets error for empty vendorName', () => {
    const nextErrors = validateMealFields(formState);

    expect(nextErrors).to.deep.equal({
      vendorName: 'Enter the name on your receipt',
    });
  });

  it('clears vendorName error if valid', () => {
    formState.vendorName = 'Test Vendor';
    errors.vendorName = 'Previous error';

    const nextErrors = validateMealFields(formState);

    expect(nextErrors.vendorName).to.equal(null);
  });

  it('validates only the specified field (vendorName) when fieldName is provided', () => {
    const nextErrors = validateMealFields(formState, 'vendorName');

    expect(nextErrors.vendorName).to.equal('Enter the name on your receipt');
  });

  it('does not include unrelated fields in validation result', () => {
    formState.vendorName = 'Test Vendor';

    const nextErrors = validateMealFields(formState);

    // Only vendorName should be in the result
    expect(nextErrors.vendorName).to.equal(null);
    expect(nextErrors.otherField).to.be.undefined;
  });
});
