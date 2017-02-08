import _ from 'lodash/fp';
import { Validator } from 'jsonschema';

import { retrieveSchema } from 'react-jsonschema-form/lib/utils';

import { isValidSSN, isValidPartialDate, isValidDateRange, isValidRoutingNumber, isValidUSZipCode, isValidCanPostalCode } from '../utils/validations';
import { parseISODate, updateRequiredFields } from './helpers';

/*
 * This contains the code for supporting our own custom validations and messages
 */

/*
 * Override the default messages for these json schema error types
 */
const defaultMessages = {
  required: 'Please provide a response',
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
  const cleanPath = path.replace('instance.', '').replace(/\[\d+\]/g, '.items');
  const pathSpecificMessage = _.get(`${cleanPath}['ui:errorMessages'].${name}`, uiSchema);
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

export function uiSchemaValidate(errors, uiSchema, schema, definitions, formData, formContext, path = '') {
  if (uiSchema) {
    const schemaWithDefinitions = retrieveSchema(schema, definitions);
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
        uiSchemaValidate(errors, uiSchema.items, schemaWithDefinitions.items, definitions, formData, formContext, newPath);
      });
    } else if (!uiSchema.items) {
      Object.keys(uiSchema)
        .filter(prop => !prop.startsWith('ui:'))
        .forEach((item) => {
          const nextPath = path !== '' ? `${path}.${item}` : item;
          if (!_.get(nextPath, errors)) {
            _.get(path, errors)[item] = {
              __errors: [],
              addError(error) {
                this.__errors.push(error);
              }
            };
          }
          uiSchemaValidate(errors, uiSchema[item], schemaWithDefinitions.properties[item], definitions, formData, formContext, nextPath);
        });
    }

    const validations = uiSchema['ui:validations'];
    if (validations && currentData) {
      validations.forEach(validation => {
        const pathErrors = path ? _.get(path, errors) : errors;
        if (typeof validation === 'function') {
          validation(pathErrors, currentData, formData, schemaWithDefinitions, uiSchema['ui:errorMessages']);
        } else {
          validation.validator(pathErrors, currentData, formData, schemaWithDefinitions, uiSchema['ui:errorMessages'], validation.options);
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

  const v = new Validator();

  return form.privacyAgreementAccepted && Object.keys(pages).every(page => {
    const pageConfig = pageConfigs.filter(config => config.pageKey === page)[0];
    const currentSchema = updateRequiredFields(pageConfig.schema, pageConfig.uiSchema, pages[page].data);

    const result = v.validate(
      pages[page].data,
      currentSchema
    );

    if (result.valid) {
      const errors = {};
      uiSchemaValidate(errors, pageConfig.uiSchema, currentSchema, currentSchema.definitions, pages[page].data, {});

      return errorSchemaIsValid(errors);
    }

    return false;
  });
}


export function validateSSN(errors, ssn) {
  if (ssn && !isValidSSN(ssn)) {
    errors.addError('Please enter a valid nine digit SSN (dashes allowed)');
  }
}

export function validateDate(errors, dateString) {
  const { day, month, year } = parseISODate(dateString);
  if (!isValidPartialDate(day, month, year)) {
    errors.addError('Please provide a valid date');
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
    errors.to.addError(errorMessages.dateRange || 'To date must be before from date');
  }
}
