import { TRIP_TYPES } from '../constants';

/**
 * Enum-like constant representing the types of validation for date fields.
 *
 * Used to control when certain validation errors should be shown:
 *  - CHANGE: triggered when the user is typing/changing the input.
 *            Required errors are NOT shown in this case.
 *  - BLUR: triggered when the input loses focus.
 *          Required errors are NOT shown in this case.
 *  - SUBMIT: triggered when the form is submitted.
 *            Required errors WILL be shown if the field is empty.
 */
export const DATE_VALIDATION_TYPE = Object.freeze({
  CHANGE: 'CHANGE',
  BLUR: 'BLUR',
  SUBMIT: 'SUBMIT',
});

/**
 * Normalizes date values coming from VaMemorableDate into a safe ISO format.
 *
 * VaMemorableDate can emit:
 *  - Strings with non-padded month/day values (e.g. "2025-8-5")
 *    and sometimes includes a time portion (e.g. "2025-8-5T08:30:00Z").
 *  - Objects with separate year, month, and day fields
 *    (e.g. { year: "2025", month: "8", day: "5" }).
 *
 * This helper:
 *  - Handles both string and object inputs
 *  - Returns partial objects as-is without modifying them
 *  - Strips any time information from string inputs
 *  - Zero-pads month and day for complete dates
 *  - Returns a consistent "YYYY-MM-DD" string for complete dates
 *
 * This ensures reliable date comparisons and consistent backend payloads
 * while avoiding errors when partial dates are entered.
 */
export const normalizeISODate = value => {
  if (!value) return '';

  // Handle object input (partial or full)
  if (typeof value === 'object') {
    const { year, month, day } = value;
    if (!year || !month || !day) return value; // partial object, return as-is
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  // Handle string input
  if (typeof value === 'string') {
    if (!value.includes('-')) return value; // malformed string, return as-is
    const [dateOnly] = value.split('T');
    const parts = dateOnly.split('-');
    if (parts.length !== 3) return value; // partial string, return as-is
    const [year, month, day] = parts;
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  // For any other type, just return it
  return value;
};

/**
 * Parses a YYYY-MM-DD (or partial) date string into parts
 */
const parseISODateParts = value => {
  if (typeof value !== 'string') return {};

  const [dateOnly] = value.split('T');
  const [year, month, day] = dateOnly.split('-');

  return { year, month, day };
};

/**
 * Determines date completeness
 */
const getDateCompleteness = value => {
  const { year, month, day } = parseISODateParts(value);

  const y = year ? parseInt(year, 10) : null;
  const m = month ? parseInt(month, 10) : null;
  const d = day ? parseInt(day, 10) : null;

  const parts = [y, m, d];

  return {
    isAllEmpty: parts.every(p => !p),
    isComplete: parts.every(p => Number.isInteger(p)),
    isPartial: parts.some(Number.isInteger) && !parts.every(Number.isInteger),
  };
};

/**
 * Returns true if the given ISO date (YYYY-MM-DD) is in the future.
 */
const isFutureDate = isoDate => {
  if (typeof isoDate !== 'string') return false;

  const { year, month, day } = parseISODateParts(isoDate);

  if (!year || !month || !day) return false;

  const selectedDate = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate > today;
};

/**
 * Validates the purchase date of a receipt.
 *
 * Rules:
 *  - Shows a required error only when all three date fields (month, day, year) are empty
 *    and the validation type is SUBMIT.
 *  - Shows a future-date error only when all three fields are provided.
 *  - Partial dates (e.g., only month entered) do not trigger any errors.
 *
 * There are 3 validation types:
 *  - CHANGE: don't show required error
 *  - BLUR: don't show required error
 *  - SUBMIT: show required error
 *
 * @param {string|object} dateInput - The date value from the form. Can be a string
 *                                     like "01-01-2025" or an object { month, day, year }.
 * @param {string} type - The type of validation to perform: CHANGE, BLUR, or SUBMIT.
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
export const validateReceiptDate = (dateInput, type, setExtraFieldErrors) => {
  // Always start by clearing any previous error
  let error = null;

  const rawDate =
    typeof dateInput === 'object' && dateInput !== null
      ? [dateInput.year, dateInput.month, dateInput.day]
          .filter(Boolean)
          .join('-')
      : dateInput;

  // Normalize first to ensure consistent YYYY-MM-DD shape
  const normalizedDate = normalizeISODate(rawDate);

  const { isAllEmpty, isComplete, isPartial } = getDateCompleteness(
    normalizedDate,
  );

  if (isPartial) {
    // Only part of the date entered
    error = 'Please enter a complete date';
  } else if (type === DATE_VALIDATION_TYPE.SUBMIT && isAllEmpty) {
    // No date entered on submit
    error = 'Enter the date of your receipt';
  } else if (isComplete && isFutureDate(normalizedDate)) {
    error = "Don't enter a future date";
  }

  setExtraFieldErrors(prev => ({
    ...prev,
    purchaseDate: error,
  }));

  return !error;
};

/**
 * Validates the description field of an expense.
 *
 * Rules:
 *  - Must not be empty when type is SUBMIT.
 *  - Must be at least 5 characters long.
 *  - Must be no more than 2,000 characters long.
 *
 * @param {string} description - The value of the description field from the form.
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @returns {boolean} - Returns true if the description is valid, false otherwise.
 */
export const validateDescription = (description, setExtraFieldErrors, type) => {
  // Always start by clearing any previous error
  let error = null;

  if (type === DATE_VALIDATION_TYPE.SUBMIT && !description) {
    error = 'Enter a description';
  } else if (description?.length > 0 && description.length < 5) {
    error = 'Enter at least 5 characters';
  } else if (description?.length > 2000) {
    error = 'Enter no more than 2,000 characters';
  }

  setExtraFieldErrors(prev => ({ ...prev, description: error }));
  return !error;
};

/**
 * Validates the requested amount field of an expense.
 *
 * Rules:
 *  - Must not be empty (SUBMIT only)
 *  - Must be a number
 *  - Must have at most 2 decimal places
 *  - Must be greater than 0
 *  - On BLUR, auto-formats to 2 decimal places (e.g., 2.5 → 2.50)
 *
 * @param {string|number} amount - The value of the costRequested field from the form.
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @param {function} setFormState - (Optional) State setter for the form, used to update the formatted value on BLUR.
 * @param {string} fieldName - (Optional) Name of the field in formState, defaults to 'costRequested'.
 * @returns {boolean} - Returns true if the requested amount is valid, false otherwise.
 */
export const validateRequestedAmount = (
  amount,
  setExtraFieldErrors,
  type = DATE_VALIDATION_TYPE.SUBMIT,
  setFormState,
  fieldName = 'costRequested',
) => {
  // Always start by clearing any previous error
  let error = null;

  const strAmount = (amount ?? '').toString().trim();

  if (type === DATE_VALIDATION_TYPE.SUBMIT && strAmount === '') {
    error = 'Enter an amount';
  }

  if (strAmount !== '') {
    const parsed = parseFloat(strAmount);

    // Check if it's a number using regex (allow optional decimal, max 2 decimals)
    const validNumberPattern = /^\d+(\.\d*)?$/;
    if (!error && !validNumberPattern.test(strAmount)) {
      error = 'Enter an amount in numbers';
    }

    // Check decimal places (max 2)
    if (!error && strAmount.includes('.')) {
      const decimals = strAmount.split('.')[1] || '';
      if (decimals.length > 2) {
        error = 'Enter an amount using this format: x.xx';
      }
    }

    // Check greater than 0
    if (!error && parsed <= 0) {
      error = 'Enter an amount greater than 0';
    }

    // Auto-format to 2 decimal places on BLUR if valid
    if (
      !error &&
      !Number.isNaN(parsed) &&
      type === DATE_VALIDATION_TYPE.BLUR &&
      setFormState
    ) {
      const formatted = parsed.toFixed(2);
      setFormState(prev => ({
        ...prev,
        [fieldName]: formatted,
      }));
    }
  }

  // Update error state
  setExtraFieldErrors(prev => ({ ...prev, [fieldName]: error }));

  return !error;
};

/**
 * Helper to determine which fields to validate.
 *
 * If fieldName is provided, only that field is validated.
 * Otherwise, allFields are validated.
 *
 * @param {string[]} allFields - List of all fields for the expense type.
 * @param {string} [fieldName] - Optional field being updated.
 * @returns {string[]} - Array of field names to validate
 */
const getFieldsToValidate = (allFields, fieldName) => {
  return fieldName ? [fieldName] : allFields;
};

/**
 * Validates AirTravel expense fields for a form.
 *
 * Rules:
 *  - vendorName: required
 *  - tripType: required
 *  - departureDate: required; must be before returnDate if returnDate exists
 *  - returnDate: required if tripType === 'ROUND_TRIP'; must be after departureDate if both exist
 *  - departedFrom: required
 *  - arrivedTo: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (pass fieldName)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the single field to validate
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateAirTravelFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  const allFields = [
    'vendorName',
    'tripType',
    'departureDate',
    'returnDate',
    'departedFrom',
    'arrivedTo',
  ];

  // Determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(allFields, fieldName);

  if (
    fieldName === 'departureDate' &&
    formState.returnDate &&
    !fieldsToValidate.includes('returnDate')
  ) {
    // If departureDate is being updated and returnDate exists, also validate returnDate
    fieldsToValidate.push('returnDate');
  } else if (
    fieldName === 'returnDate' &&
    formState.departureDate &&
    !fieldsToValidate.includes('departureDate')
  ) {
    // If returnDate is being updated and departureDate exists, also validate departureDate
    fieldsToValidate.push('departureDate');
  } else if (
    fieldName === 'tripType' &&
    formState.returnDate !== '' &&
    !fieldsToValidate.includes('returnDate')
  ) {
    // If tripType is being updated and returnDate exists, also validate returnDate
    fieldsToValidate.push('returnDate');
  } else if (
    fieldName === 'returnDate' &&
    formState.tripType === TRIP_TYPES.ONE_WAY.value &&
    !fieldsToValidate.includes('tripType')
  ) {
    // If returnDate is being updated and tripType is ONE_WAY, also validate tripType
    fieldsToValidate.push('tripType');
  }

  // vendorName
  if (fieldsToValidate.includes('vendorName')) {
    if (!formState.vendorName) nextErrors.vendorName = 'Enter the company name';
    else delete nextErrors.vendorName;
  }

  // tripType
  if (fieldsToValidate.includes('tripType')) {
    if (!formState.tripType) nextErrors.tripType = 'Select a trip type';
    else if (
      formState.tripType === TRIP_TYPES.ONE_WAY.value &&
      formState.returnDate
    ) {
      nextErrors.tripType = 'You entered a return date for a one-way trip';
    } else delete nextErrors.tripType;
  }

  // departureDate
  if (fieldsToValidate.includes('departureDate')) {
    if (!formState.departureDate)
      nextErrors.departureDate = 'Enter a departure date';
    else if (
      formState.returnDate &&
      formState.departureDate > formState.returnDate
    )
      nextErrors.departureDate = 'Departure date must be before return date';
    else delete nextErrors.departureDate;
  }

  // returnDate
  if (fieldsToValidate.includes('returnDate')) {
    if (
      formState.tripType === TRIP_TYPES.ROUND_TRIP.value &&
      !formState.returnDate
    ) {
      nextErrors.returnDate = 'Enter a return date';
    } else if (
      formState.departureDate &&
      formState.returnDate &&
      formState.returnDate < formState.departureDate
    ) {
      nextErrors.returnDate = 'Return date must be later than departure date';
    } else if (
      formState.tripType === TRIP_TYPES.ONE_WAY.value &&
      formState.returnDate
    ) {
      nextErrors.returnDate = 'You entered a return date for a one-way trip';
    } else {
      delete nextErrors.returnDate;
    }
  }

  // departedFrom
  if (fieldsToValidate.includes('departedFrom')) {
    if (!formState.departedFrom)
      nextErrors.departedFrom = 'Enter the airport name';
    else delete nextErrors.departedFrom;
  }

  // arrivedTo
  if (fieldsToValidate.includes('arrivedTo')) {
    if (!formState.arrivedTo) nextErrors.arrivedTo = 'Enter the airport name';
    else delete nextErrors.arrivedTo;
  }

  return nextErrors;
};

/**
 * Validates CommonCarrier expense fields for a form.
 *
 * Rules:
 *  - carrierType: required
 *  - reasonNotUsingPOV: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (determined via getFieldsToValidate)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateCommonCarrierFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(
    ['carrierType', 'reasonNotUsingPOV'],
    fieldName,
  );

  // carrierType
  if (fieldsToValidate.includes('carrierType')) {
    if (!formState.carrierType)
      nextErrors.carrierType = 'Select a transportation type';
    else delete nextErrors.carrierType;
  }

  // reasonNotUsingPOV
  if (fieldsToValidate.includes('reasonNotUsingPOV')) {
    if (!formState.reasonNotUsingPOV)
      nextErrors.reasonNotUsingPOV = 'Select a reason';
    else delete nextErrors.reasonNotUsingPOV;
  }

  return nextErrors;
};

/**
 * Validates Lodging expense fields for a form.
 *
 * Rules:
 *  - vendor: required
 *  - checkInDate: required
 *  - checkOutDate: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (determined via getFieldsToValidate)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateLodgingFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  const allFields = ['vendor', 'checkInDate', 'checkOutDate'];

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(allFields, fieldName);

  // If one of the date fields is being updated, also validate the other
  if (
    fieldName === 'checkInDate' &&
    formState.checkOutDate &&
    !fieldsToValidate.includes('checkOutDate')
  ) {
    fieldsToValidate.push('checkOutDate');
  } else if (
    fieldName === 'checkOutDate' &&
    formState.checkInDate &&
    !fieldsToValidate.includes('checkInDate')
  ) {
    fieldsToValidate.push('checkInDate');
  }

  // vendor
  if (fieldsToValidate.includes('vendor')) {
    if (!formState.vendor) {
      nextErrors.vendor = 'Enter the name on your receipt';
    } else {
      delete nextErrors.vendor;
    }
  }

  // checkInDate
  if (fieldsToValidate.includes('checkInDate')) {
    const normalizedCheckIn = normalizeISODate(formState.checkInDate);
    const { isAllEmpty, isPartial, isComplete } = getDateCompleteness(
      normalizedCheckIn,
    );

    if (isPartial) {
      nextErrors.checkInDate = 'Please enter a complete date';
    } else if (isAllEmpty) {
      nextErrors.checkInDate = 'Enter the date you checked in';
    } else if (isComplete && isFutureDate(normalizedCheckIn)) {
      nextErrors.checkInDate = "Don't enter a future date";
    } else if (
      isComplete &&
      formState.checkOutDate &&
      getDateCompleteness(formState.checkOutDate).isComplete
    ) {
      const normalizedCheckOut = normalizeISODate(formState.checkOutDate);

      if (normalizedCheckIn >= normalizedCheckOut) {
        nextErrors.checkInDate =
          'Check-in date must be earlier than check-out date';
      } else {
        delete nextErrors.checkInDate;
      }
    } else {
      delete nextErrors.checkInDate;
    }
  }

  // checkOutDate
  if (fieldsToValidate.includes('checkOutDate')) {
    const normalizedCheckOut = normalizeISODate(formState.checkOutDate);
    const { isAllEmpty, isPartial, isComplete } = getDateCompleteness(
      normalizedCheckOut,
    );
    if (isPartial) {
      nextErrors.checkOutDate = 'Please enter a complete date';
    } else if (isAllEmpty) {
      nextErrors.checkOutDate = 'Enter the date you checked out';
    } else if (isComplete && isFutureDate(normalizedCheckOut)) {
      nextErrors.checkOutDate = "Don't enter a future date";
    } else if (
      isComplete &&
      formState.checkInDate &&
      getDateCompleteness(formState.checkInDate).isComplete
    ) {
      const normalizedCheckIn = normalizeISODate(formState.checkInDate);

      if (normalizedCheckOut <= normalizedCheckIn) {
        nextErrors.checkOutDate =
          'Check-out date must be later than check-in date';
      } else {
        delete nextErrors.checkOutDate;
      }
    } else {
      delete nextErrors.checkOutDate;
    }
  }

  return nextErrors;
};

/**
 * Validates Meal expense fields for a form.
 *
 * Rules:
 *  - vendorName: required
 *
 * Can validate all fields or a single field (via `fieldName`).
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateMealFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(['vendorName'], fieldName);

  if (fieldsToValidate.includes('vendorName')) {
    nextErrors.vendorName = formState.vendorName
      ? undefined
      : 'Enter the name on your receipt';

    if (!nextErrors.vendorName) delete nextErrors.vendorName;
  }

  return nextErrors;
};
