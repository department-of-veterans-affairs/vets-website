import _ from 'lodash/fp';
import { isValidSSN, isValidPartialDate } from '../utils/validations';
import { parseISODate } from './helpers';

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
  const cleanPath = path.replace('instance.', '');
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

/**
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

export function uiSchemaValidate(errors, uiSchema, formData, otherData, path = '') {
  const currentData = _.get(path, formData);
  if (uiSchema.items) {
    currentData.forEach((item, index) => {
      const newPath = `${path}[${index}]`;
      if (!_.get(newPath, errors)) {
        _.get(path, errors)[index] = {
          __errors: [],
          addError(error) {
            this.__errors.push(error);
          }
        };
      }
      uiSchemaValidate(errors, uiSchema.items, formData, otherData, newPath);
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
        uiSchemaValidate(errors, uiSchema[item], formData, otherData, nextPath);
      });
  }

  if (typeof uiSchema['ui:requiredIf'] === 'function') {
    if (uiSchema['ui:requiredIf'](formData) && !currentData) {
      _.get(path, errors).addError(defaultMessages.required);
    }
  }

  const validations = uiSchema['ui:validations'];
  if (validations && currentData) {
    validations.forEach(validation => {
      if (typeof validation === 'function') {
        validation(_.get(path, errors), currentData, formData, otherData);
      } else {
        validation.validator(_.get(path, errors), currentData, formData, otherData, validation.options);
      }
    });
  }

  return errors;
}

export function validateSSN(errors, ssn) {
  if (!isValidSSN(ssn)) {
    errors.addError('Please enter a valid nine digit SSN (dashes allowed)');
  }
}

export function validateDate(errors, dateString) {
  const { day, month, year } = parseISODate(dateString);
  if (!isValidPartialDate(day, month, year)) {
    errors.addError('Please provide a valid date');
  }
}

export function validateGroup(message) {
  return (errors, group) => {
    if (!_.values(group).some(val => val === true)) {
      errors.addError(message);
    }
  };
}

export function validateEmailsMatch(errors, formData) {
  const { email, confirmEmail } = formData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}
