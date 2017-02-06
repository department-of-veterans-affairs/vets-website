import _ from 'lodash/fp';
import { Validator } from 'jsonschema';

import { isValidSSN, isValidPartialDate, isValidDateRange, isNotBlank } from '../utils/validations';
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

export function uiSchemaValidate(errors, uiSchema, formData, formContext, path = '') {
  if (uiSchema) {
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
        uiSchemaValidate(errors, uiSchema.items, formData, formContext, newPath);
      });
    } else {
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
          uiSchemaValidate(errors, uiSchema[item], formData, formContext, nextPath);
        });
    }

    const validations = uiSchema['ui:validations'];
    if (validations && currentData) {
      validations.forEach(validation => {
        const pathErrors = path ? _.get(path, errors) : errors;
        if (typeof validation === 'function') {
          validation(pathErrors, currentData, formData, formContext, uiSchema['ui:errorMessages']);
        } else {
          validation.validator(pathErrors, currentData, formData, formContext, uiSchema['ui:errorMessages'], validation.options);
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
      uiSchemaValidate(errors, pageConfig.uiSchema, pages[page].data, {});

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

export function validateAddress(errors, formData) {
  // if (!isValidAddressField(address)) {
  //   errors.addError('Please provide a valid address');
  // }

  const address = formData;
  console.log({'address': address});
  console.log({'errors': errors});
  // const country = address.country.value || address.country;

  // errors.addError('Please provide a valid address');

  // if () {
  //   const initialOk = isNotBlank(address.street.value) &&
  //     isNotBlank(address.city.value) &&
  //     isNotBlank(country);

  //   let isValidPostalCode = true;

  //   if (country === 'USA') {
  //     isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidUSZipCode, address.postalCode);
  //   }

  //   if (country === 'CAN') {
  //     isValidPostalCode = isValidPostalCode && isValidRequiredField(isValidCanPostalCode, address.postalCode);
  //   }

  //   // if we have a defined list of values, they will
  //   // be set as the state and zipcode keys
  //   if (_.hasIn(states, country)) {
  //     return initialOk &&
  //       isNotBlank(address.state.value) &&
  //       isValidPostalCode;
  //   }
  //   // if the entry was non-USA/CAN/MEX, only postal is
  //   // required, not provinceCode
  //   return initialOk && isNotBlank(address.postalCode.value);
  // }
}

export function validateEmailsMatch(errors, formData) {
  const { email, confirmEmail } = formData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
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
