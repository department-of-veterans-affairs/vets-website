import find from 'lodash/find';
import { Validator } from 'jsonschema';
import get from '../../../utilities/data/get';
import omit from '../../../utilities/data/omit';
import set from '../../../utilities/data/set';
import unset from '../../../utilities/data/unset';
import navigationState from './utilities/navigation/navigationState';
import { isActivePage, parseISODate, minYear, maxYear } from './helpers';
import {
  isValidSSN,
  isValidYear,
  isValidVAFileNumber,
  isValidCurrentOrPastDate,
  isValidCurrentOrPastYear,
  isValidCurrentOrFutureDate,
  isValidCurrentOrFutureMonthYear,
  isValidDateRange,
  isValidRoutingNumber,
  isValidPartialMonthYear,
  isValidPartialMonthYearInPast,
  isValidDate,
  isValidPartialDate,
} from './utilities/validations';

/*
 * This contains the code for supporting our own custom validations and messages
 */

/*
 * Override the default messages for these json schema error types
 */
const defaultMessages = {
  required: 'You must provide a response',
  enum: 'You must select a valid option',
  maxLength: max => `This field should be less than ${max} characters`,
  minLength: min => `This field should be at least ${min} character(s)`,
  format: type => {
    if (type === 'email') {
      return 'You must enter a valid email address';
    }

    return 'You must enter a valid value';
  },
};

function getMessage(path, name, uiSchema, errorArgument) {
  let pathSpecificMessage;
  if (path === 'instance') {
    pathSpecificMessage = get(['ui:errorMessages', name], uiSchema);
  } else {
    const cleanPath = path
      .replace('instance.', '')
      .replace(/\[\d+\]/g, '.items');
    pathSpecificMessage = get(
      `${cleanPath}[ui:errorMessages].${name}`,
      uiSchema,
    );
  }

  if (pathSpecificMessage) {
    return pathSpecificMessage;
  }

  return typeof defaultMessages[name] === 'function'
    ? defaultMessages[name](errorArgument)
    : defaultMessages[name];
}

/*
 * This takes the list of errors outputted by the json schema node library
 * and moves the required errors to the missing field, rather than the containing
 * object.
 *
 * It also replaces the error messages with any form specific messages.
 */
export function transformErrors(errors, uiSchema) {
  return errors.map(error => {
    if (error.name === 'required') {
      const path = `${error.property}.${error.argument}`;
      return {
        ...error,
        property: path,
        message: getMessage(path, error.name, uiSchema, error.argument),
      };
    }

    const newMessage = getMessage(
      error.property,
      error.name,
      uiSchema,
      error.argument,
    );
    if (newMessage) {
      return set('message', newMessage, error);
    }

    return error;
  });
}

/**
 * This pulls custom validations specified in the uiSchema and validates the formData
 * against them.
 *
 * Expects validations that look like:
 *
 * someField: {
 *   "ui:validations": [
 *     someValidation
 *   ]
 * }
 *
 * Each item in the ui:validations array can be a function OR an object:
 *    - Functions are called with (in order)
 *        pathErrors:                   Errors object for the field
 *        currentData:                  Data for the field
 *        formData:                     Current form data
 *        schema:                       Current JSON Schema for the field
 *        uiSchema['ui:errorMessages']: Error message object (if available) for the field
 *        currentIndex:                 Used to select the correct field data to validate against
 *    - Objects should have two properties, 'options' and 'validator'
 *        options:   Object (or anything, really) that will be passed to your validation function.
 *                   You can use this to allow your validation function to be configurable for
 *                   different fields on the form.
 *        validator: Same signature as function above, but with extra 'options' object as the
 *                   second-to-last argument (...options, currentIndex)
 * Both versions of custom validators should call `addError()` to actually add any errors to the
 * errors object
 *
 * @param {Object} errors Errors object from rjsf, which includes an addError method
 * @param {Object} uiSchema The uiSchema for the current field
 * @param {Object} schema The schema for the current field
 * @param {Object} formData The (flattened) data for the entire form
 * @param {string} [path] The path to the current field relative to the root of the page.
 * @param {number} [currentIndex] Used to select the correct field data to validate against
 * @param {Object} [appStateData] Data from the app state
 * @param {({ all }) => any} [getFormData] Function to get the form data. Useful if you need all form data
 */

export function uiSchemaValidate(
  errors,
  uiSchema,
  schema,
  formData,
  path = '',
  currentIndex = null,
  appStateData,
  getFormData,
) {
  if (uiSchema && schema) {
    const currentData = path !== '' ? get(path, formData) : formData;
    if (uiSchema.items && currentData) {
      currentData.forEach((item, index) => {
        const newPath = `${path}[${index}]`;
        const currentSchema =
          index < schema.items.length
            ? schema.items[index]
            : schema.additionalItems;
        if (!get(newPath, errors)) {
          const currentErrors = path ? get(path, errors) : errors;
          currentErrors[index] = {
            __errors: [],
            addError(error) {
              this.__errors.push(error);
            },
          };
        }
        uiSchemaValidate(
          errors,
          uiSchema.items,
          currentSchema,
          formData,
          newPath,
          index,
          appStateData,
          getFormData,
        );
      });
    } else if (!uiSchema.items) {
      Object.keys(uiSchema)
        .filter(prop => !prop.startsWith('ui:'))
        .forEach(item => {
          const nextPath = path !== '' ? `${path}.${item}` : item;
          if (!get(nextPath, errors)) {
            const currentErrors = path === '' ? errors : get(path, errors);

            currentErrors[item] = {
              __errors: [],
              addError(error) {
                this.__errors.push(error);
              },
            };
          }
          uiSchemaValidate(
            errors,
            uiSchema[item],
            schema.properties[item],
            formData,
            nextPath,
            currentIndex,
            appStateData,
            getFormData,
          );
        });
    }

    const validations = uiSchema['ui:validations'];
    const useAllFormData = uiSchema?.['ui:options']?.useAllFormData;
    const data =
      useAllFormData && getFormData ? getFormData({ all: true }) : formData;
    if (validations && currentData !== undefined) {
      validations.forEach(validation => {
        const pathErrors = path ? get(path, errors) : errors;
        if (typeof validation === 'function') {
          validation(
            pathErrors,
            currentData,
            data,
            schema,
            uiSchema['ui:errorMessages'],
            currentIndex,
            appStateData,
          );
        } else {
          validation.validator(
            pathErrors,
            currentData,
            data,
            schema,
            uiSchema['ui:errorMessages'],
            validation.options,
            currentIndex,
            appStateData,
          );
        }
      });
    }
  }
  return errors;
}

export function errorSchemaIsValid(errorSchema) {
  if (errorSchema && errorSchema.__errors && errorSchema.__errors.length) {
    return false;
  }

  return Object.values(omit('__errors', errorSchema)).every(errorSchemaIsValid);
}

/**
 * IsValidForm~results
 * @typedef {Object}
 * @property {Boolean} isValid - Returns true if the formData & schema match and
 *  are valid
 * @property {Object[]} errors - Errors returned by jsonschema validator
 * @property {Object|null} formData - Only available during unit tests
 */
/**
 * Use third-party jsonschema validator to validate the formData against the
 * schema
 * @param {Object} form - the entire form object from Redux state
 * @param {Object[]} pageList - Page list array from the router
 * @param {Boolean} isTesting - Testing flag used to return the modified form
 *  data to verify the correct changes were made
 * @returns {IsValidForm~results}
 */
export function isValidForm(form, pageList, isTesting = false) {
  const pageListMap = new Map();
  pageList.forEach(page => pageListMap.set(page.pageKey, page));
  const validPages = Object.keys(form.pages).filter(pageKey =>
    isActivePage(find(pageList, { pageKey }), form.data),
  );

  const v = new Validator();
  let getFormData;

  return validPages.reduce(
    ({ isValid, errors }, page) => {
      const {
        uiSchema,
        schema,
        showPagePerItem,
        itemFilter,
        arrayPath,
      } = form.pages[page];
      const { appStateData } = pageListMap.get(page);
      let formData = form.data;

      if (showPagePerItem) {
        const arrayData = formData[arrayPath];
        if (arrayData) {
          const itemsToKeep = arrayData.map(itemFilter || (() => true));
          // Remove the excluded array data
          formData = set(
            arrayPath,
            arrayData.filter((item, index) => itemsToKeep[index]),
            formData,
          );
          // Remove the excluded array itemSchemas
          //
          // NOTE: This will only work when `arrayPath` isn't a nested path.
          // This is consistent with other uses of arrayPath throughout the
          // library.
          if (Array.isArray(schema.properties[arrayPath].items)) {
            // `items` may be an array if the individual item schemas can be
            // different, or a single object to describe every item. We only
            // want to filter the schemas if they can be different. This ensures
            // the data still matches its corresponding schema if we filtered
            // out some data with `itemFilter`.
            schema.properties[arrayPath].items = schema.properties[
              arrayPath
            ].items.filter((item, index) => itemsToKeep[index]);
          }
        } else {
          formData = unset(arrayPath, formData);
        }
      }

      const result = v.validate(formData, schema);

      // mimics FormPage formData() function
      getFormData = ({ all }) => (all ? form.data : formData);

      if (result.valid) {
        const customErrors = {};
        uiSchemaValidate(
          customErrors,
          uiSchema,
          schema,
          formData,
          '',
          null,
          appStateData,
          getFormData,
        );

        return {
          isValid: isValid && errorSchemaIsValid(customErrors),
          errors: errors.concat(customErrors),
          formData: isTesting ? formData : null, // for unit tests
        };
      }

      return {
        isValid: false,
        // removes PII
        errors: errors.concat(
          result.errors.map(error => unset('instance', error)),
        ),
        formData: isTesting ? formData : null, // for unit tests
      };
    },
    { isValid: true, errors: [] },
  );
}

export function validateSSN(errors, ssn) {
  if (ssn && !isValidSSN(ssn)) {
    errors.addError('Please enter a valid 9 digit SSN (dashes allowed)');
  }
}

export function validateVAFileNumber(errors, vaFileNumber) {
  if (vaFileNumber && !isValidVAFileNumber(vaFileNumber)) {
    errors.addError('VA file number must be 8 or 9 digits (dashes allowed)');
  }
}

export function validateDate(
  errors,
  dateString,
  formData,
  schema,
  errorMessages,
  currentIndex,
  appStateData,
  customMinYear = minYear,
  customMaxYear = maxYear,
) {
  const { day, month, year } = parseISODate(dateString);
  if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      `Please enter a year between ${customMinYear} and ${customMaxYear}`,
    );
  } else if (!isValidPartialDate(day, month, year)) {
    errors.addError('Please provide a valid date');
  } else if (day && month && year && !isValidDate(day, month, year)) {
    errors.addError('Please provide a valid date');
  }
}

export function validateMonthYear(errors, dateString) {
  const { month, year } = parseISODate(dateString);
  if (!isValidPartialMonthYear(month, year)) {
    errors.addError('Please provide a valid date');
  }
}

/**
 * Adds an error message to errors if a date is an invalid date or in the future.
 *
 * The message it adds can be customized in uiSchema.errorMessages.futureDate
 */
export function validateCurrentOrPastDate(
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) {
  const {
    futureDate = 'Please provide a valid current or past date',
  } = errorMessages;
  validateDate(
    errors,
    dateString,
    formData,
    schema,
    errorMessages,
    undefined,
    undefined,
    minYear,
    new Date().getFullYear(),
  );
  const { day, month, year } = parseISODate(dateString);
  if (!isValidCurrentOrPastDate(day, month, year)) {
    errors.addError(futureDate);
  }
}

export function validateCurrentOrPastMemorableDate(
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) {
  const {
    futureDate = 'Please provide a valid current or past date',
  } = errorMessages;
  validateDate(
    errors,
    dateString,
    formData,
    schema,
    errorMessages,
    undefined,
    undefined,
    minYear,
    new Date().getFullYear(),
  );
  const { day, month, year } = parseISODate(dateString);
  if (!day || !month || !year || !isValidCurrentOrPastDate(day, month, year)) {
    errors.addError(futureDate);
  }
}

/**
 * Adds an error message to errors if a date is an invalid date or in the future.
 *
 * The message it adds can be customized in uiSchema.errorMessages.futureDate
 */
export function validateCurrentOrFutureDate(
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) {
  const {
    pastDate = 'Please provide a valid current or future date',
  } = errorMessages;
  validateDate(errors, dateString);
  const { day, month, year } = parseISODate(dateString);
  if (!isValidCurrentOrFutureDate(day, month, year)) {
    errors.addError(pastDate);
  }
}

export function validateCurrentOrPastMonthYear(
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) {
  const {
    futureDate = 'Please provide a valid current or past date',
  } = errorMessages;
  validateMonthYear(errors, dateString);
  const { month, year } = parseISODate(dateString);
  if (!isValidPartialMonthYearInPast(month, year)) {
    errors.addError(futureDate);
  }
}

/**
 * Adds an error message to errors if a date is an invalid date or in the past.
 */
export function validateFutureDateIfExpectedGrad(errors, dateString, formData) {
  validateDate(errors, dateString);
  const { month, year } = parseISODate(dateString);
  if (
    formData.highSchool.status === 'graduationExpected' &&
    !isValidCurrentOrFutureMonthYear(month, year)
  ) {
    errors.addError('Please provide a valid future date');
  }
}

/**
 * Adds an error message to errors if an integer year value is not between 1900 and the current year.
 */
export function validateCurrentOrPastYear(errors, year) {
  if (!isValidCurrentOrPastYear(year)) {
    errors.addError('Please provide a valid year');
  }
}

export function validateMatch(
  field1,
  field2,
  { ignoreCase } = { ignoreCase: false },
) {
  return (errors, formData) => {
    const transform = ignoreCase ? val => val?.toLowerCase() : val => val;
    if (transform(formData[field1]) !== transform(formData[field2])) {
      errors[field2].addError('Please ensure your entries match');
    }
  };
}

export function validateRoutingNumber(
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) {
  if (!isValidRoutingNumber(routingNumber)) {
    errors.addError(errorMessages.pattern);
  }
}

export function convertToDateField(dateStr) {
  const date = parseISODate(dateStr);
  return Object.keys(date).reduce((dateField, part) => {
    const datePart = {};
    datePart[part] = {
      value: date[part],
    };
    return { ...dateField, ...datePart };
  }, date);
}

export function validateDateRange(
  errors,
  dateRange,
  formData,
  schema,
  errorMessages,
  allowSameMonth = false, // This is actually only allowing the same date
) {
  const fromDate = convertToDateField(dateRange.from);
  const toDate = convertToDateField(dateRange.to);

  if (!isValidDateRange(fromDate, toDate, allowSameMonth)) {
    errors.to.addError(
      errorMessages?.pattern || 'To date must be after from date',
    );
  }
}

// using ...args here breaks unit test that don't include all parameters
export function validateDateRangeAllowSameMonth(
  errors,
  dateRange,
  formData,
  schema,
  errorMessages,
) {
  validateDateRange(errors, dateRange, formData, schema, errorMessages, true);
}

export const UPLOADING_FILE = 'Uploading file...';
export const NOT_UPLOADED = 'We couldn’t upload your file';
export const MISSING_PASSWORD_ERROR = 'Encrypted file requires a password.';
export const UNSUPPORTED_ENCRYPTED_FILE_ERROR =
  "We weren't able to upload your file. Make sure the file is not encrypted and has an accepted format.";
export const MISSING_FILE = 'File is required.';
export const MISSING_ADDITIONAL_INFO = 'This information is required.';
export const UTF8_ENCODING_ERROR = "The file's encoding is not valid";
export const DUPLICATE_FILE_ERROR =
  'You already uploaded this file. Select a different file.';
export function getFileError(file) {
  if (file.errorMessage) {
    return file.errorMessage;
  }
  if (file.uploading) {
    return UPLOADING_FILE;
  }
  // Awaiting password entry, but we need to set an error so that using the form
  // continue button blocks progression through the form; look in FileField code
  // to see that we prevent error message rendering for this particular error
  if (file.isEncrypted && !file.confirmationCode && !file.password) {
    return MISSING_PASSWORD_ERROR;
  }
  if (!file.confirmationCode) {
    return NOT_UPLOADED;
  }

  return null;
}

export function validateFileField(errors, fileList) {
  fileList.forEach((file, index) => {
    const error = getFileError(file);

    if (error && !errors[index]) {
      /* eslint-disable no-param-reassign */
      errors[index] = {
        __errors: [],
        addError(msg) {
          this.__errors.push(msg);
        },
      };
      /* eslint-enable no-param-reassign */
    }

    if (error) {
      errors[index].addError(error);
    }
  });
}

export function validateBooleanGroup(
  errors,
  userGroup,
  form,
  schema,
  errorMessages = {},
) {
  const { atLeastOne = 'Please choose at least one option' } = errorMessages;
  const group = userGroup || {};
  if (!Object.keys(group).filter(item => group[item] === true).length) {
    errors.addError(atLeastOne);
  }
}

export function validateAutosuggestOption(errors, formData) {
  if (
    formData &&
    formData.widget === 'autosuggest' &&
    !formData.id &&
    formData.label
  ) {
    errors.addError('Please select an option from the suggestions');
  }
}

export function validateTelephoneInput(
  errors,
  { _isValid, _error, _touched, _required, contact },
) {
  // was validation triggered by navigation attempt
  const navState = navigationState.getNavigationEventStatus();

  let valid = _isValid;
  const notRequiredEmpty = !_required && !contact;
  const requiredUntouchedNotNav = (!_touched || !contact) && !navState;
  if (notRequiredEmpty || requiredUntouchedNotNav) {
    valid = true;
  }

  if (!valid) {
    errors.addError(_error);
  }
}

/**
 * @param {Object | Object[]} data - object or array containing file data
 * @returns {Boolean} is there a file
 */
export function filePresenceValidation(data) {
  // file input multiple
  if (Array.isArray(data)) {
    let hasFile = false;
    for (const file of data) {
      const _hasFile = file.confirmationCode && file.name && file.size;
      if (_hasFile) {
        hasFile = true;
        break;
      }
    }
    return hasFile;
  }
  // file input single
  return !!data.confirmationCode && !!data.name && !!data.size;
}
