import _ from 'lodash/fp';
import { Validator } from 'jsonschema';

import {
  isValidSSN,
  isValidPartialDate,
  isValidCurrentOrPastDate,
  isValidFutureDate,
  isValidDateRange,
  isValidRoutingNumber,
  isValidUSZipCode,
  isValidCanPostalCode
} from '../utils/validations';

import { parseISODate } from './helpers';
import { isActivePage } from '../utils/helpers';

/*
 * This contains the code for supporting our own custom validations and messages
 */

/*
 * Override the default messages for these json schema error types
 */
const defaultMessages = {
  required: 'Please provide a response',
  'enum': 'Please select a valid option',
  maxLength: (max) => `This field should be less than ${max} characters`,
  minLength: (min) => `This field should be at least ${min} character(s)`,
  format: (type) => {
    if (type === 'email') {
      return 'Please enter a valid email address';
    }

    return 'Please enter a valid value';
  }
};

function getMessage(path, name, uiSchema, errorArgument) {
  let pathSpecificMessage;
  if (path === 'instance') {
    pathSpecificMessage = _.get(['ui:errorMessages', name], uiSchema);
  } else {
    const cleanPath = path.replace('instance.', '').replace(/\[\d+\]/g, '.items');
    pathSpecificMessage = _.get(`${cleanPath}['ui:errorMessages'].${name}`, uiSchema);
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
  const newErrors = errors.map(error => {
    if (error.name === 'required') {
      const path = `${error.property}.${error.argument}`;
      return _.assign(error, {
        property: path,
        message: getMessage(path, error.name, uiSchema, error.argument)
      });
    }

    const newMessage = getMessage(error.property, error.name, uiSchema, error.argument);
    if (newMessage) {
      return _.set('message', newMessage, error);
    }

    return error;
  });

  return newErrors;
}

/*
 * This pulls custom validations specified in the uiSchema and validates the formData
 * against them.
 *
 * Expects validations that look like:
 *
 * someField: {
 *   "ui:validations": [
 *     someValidationFunction,
 *   ]
 * }
 *
 * The function is passed errors, fieldData, formData, and otherData and
 * should call addError to add the error.
 */

export function uiSchemaValidate(errors, uiSchema, schema, formData, formContext, path = '') {
  if (uiSchema && schema) {
    const currentData = path !== '' ? _.get(path, formData) : formData;
    if (uiSchema.items && currentData) {
      currentData.forEach((item, index) => {
        const newPath = `${path}[${index}]`;
        if (!_.get(newPath, errors)) {
          const currentErrors = path ? _.get(path, errors) : errors;
          currentErrors[index] = {
            __errors: [],
            addError(error) {
              this.__errors.push(error);
            }
          };
        }
        uiSchemaValidate(errors, uiSchema.items, schema.items, formData, formContext, newPath);
      });
    } else if (!uiSchema.items) {
      Object.keys(uiSchema)
        .filter(prop => !prop.startsWith('ui:'))
        .forEach((item) => {
          const nextPath = path !== '' ? `${path}.${item}` : item;
          if (!_.get(nextPath, errors)) {
            const currentErrors = path === ''
              ? errors
              : _.get(path, errors);

            currentErrors[item] = {
              __errors: [],
              addError(error) {
                this.__errors.push(error);
              }
            };
          }
          uiSchemaValidate(errors, uiSchema[item], schema.properties[item], formData, formContext, nextPath);
        });
    }

    const validations = uiSchema['ui:validations'];
    if (validations && currentData) {
      validations.forEach(validation => {
        const pathErrors = path ? _.get(path, errors) : errors;
        if (typeof validation === 'function') {
          validation(pathErrors, currentData, formData, schema, uiSchema['ui:errorMessages']);
        } else {
          validation.validator(pathErrors, currentData, formData, schema, uiSchema['ui:errorMessages'], validation.options);
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

  return _.values(_.omit('__errors', errorSchema)).every(errorSchemaIsValid);
}

export function isValidForm(form, pageListByChapters) {
  const pageConfigs = _.flatten(_.values(pageListByChapters));
  const pages = _.omit(['privacyAgreementAccepted', 'submission'], form);
  const validPages = Object.keys(pages)
    .filter(pageKey => isActivePage(_.find({ pageKey }, pageConfigs), form));

  const v = new Validator();

  return form.privacyAgreementAccepted && validPages.every(page => {
    const { uiSchema, schema, data } = pages[page];

    const result = v.validate(
      data,
      schema
    );

    if (result.valid) {
      const errors = {};
      uiSchemaValidate(errors, uiSchema, schema, data, {});

      return errorSchemaIsValid(errors);
    }

    return false;
  });
}


export function validateSSN(errors, ssn) {
  if (ssn && !isValidSSN(ssn)) {
    errors.addError('Please enter a valid 9 digit SSN (dashes allowed)');
  }
}

export function validateDate(errors, dateString) {
  const { day, month, year } = parseISODate(dateString);
  if (!isValidPartialDate(day, month, year)) {
    errors.addError('Please provide a valid date');
  }
}

/**
 * Adds an error message to errors if a date is an invalid date or in the future.
 *
 * The message it adds can be customized in uiSchema.errorMessages.futureDate
 */
export function validateCurrentOrPastDate(errors, dateString, formData, formContext, errorMessages) {
  validateDate(errors, dateString);
  const { day, month, year } = parseISODate(dateString);
  if (!isValidCurrentOrPastDate(day, month, year)) {
    errors.addError(errorMessages.futureDate || 'Please provide a valid current or past date');
  }
}

/**
 * Adds an error message to errors if a date is an invalid date or in the past.
 *
 * The message it adds can be customized in uiSchema.errorMessages.pastDate
 */
export function validateFutureDateIfExpectedGrad(errors, dateString, formData, formContext, errorMessages) {
  validateDate(errors, dateString);
  const { day, month, year } = parseISODate(dateString);
  if (formData.highSchool.status === 'graduationExpected' && !isValidFutureDate(day, month, year)) {
    errors.addError(errorMessages.pastDate || 'Please provide a valid future date');
  }
}

export function validateAddress(errors, address, formData, schema) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (_.includes(address.country)(['USA', 'CAN', 'MEX'])
    && address.state === undefined
    && schema.required) {
    errors.state.addError('Please select a state or province');
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

export function validateMatch(field1, field2) {
  return (errors, formData) => {
    if (formData[field1] !== formData[field2]) {
      errors[field2].addError('Please ensure your entries match');
    }
  };
}

export function validateRoutingNumber(errors, routingNumber, formData, formContext, errorMessages) {
  if (!isValidRoutingNumber(routingNumber)) {
    errors.addError(errorMessages.pattern);
  }
}

function convertToDateField(dateStr) {
  const date = parseISODate(dateStr);
  return Object.keys(date).reduce((dateField, part) => {
    const datePart = {};
    datePart[part] = {
      value: date[part]
    };
    return _.assign(dateField, datePart);
  }, date);
}

export function validateDateRange(errors, dateRange, formData, formContext, errorMessages) {
  const fromDate = convertToDateField(dateRange.from);
  const toDate = convertToDateField(dateRange.to);

  if (!isValidDateRange(fromDate, toDate)) {
    errors.to.addError(errorMessages.pattern || 'To date must be after from date');
  }
}
