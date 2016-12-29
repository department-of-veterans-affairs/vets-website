import _ from 'lodash/fp';

const defaultMessages = {
  required: 'Please provide a response',
  maxLength: (max) => `This field should be less than ${max} characters`,
  minLength: (min) => `This field should be at least ${min} character(s)`
};

function getMessage(path, name, messages, errorArgument) {
  const cleanPath = path.replace('instance.', '');
  const pathSpecificMessage = _.get(`${cleanPath}.${name}`, messages);
  if (pathSpecificMessage) {
    return pathSpecificMessage;
  }

  return typeof messages[name] === 'function'
    ? messages[name](errorArgument)
    : messages[name];
}

export function transformErrors(errors, messages) {
  const errorMessages = _.merge(defaultMessages, messages);
  const newErrors = errors.map(error => {
    if (error.name === 'required') {
      const path = `${error.property}.${error.argument}`;
      return _.assign(error, {
        property: path,
        message: getMessage(path, error.name, errorMessages, error.argument)
      });
    }

    const newMessage = getMessage(error.property, error.name, errorMessages, error.argument);
    if (newMessage) {
      return _.set('message', newMessage, error);
    }

    return error;
  });

  return newErrors;
}

/**
 * Expects validations that look like:
 *
 * key: {
 *   "ui:validations": [
 *     someFunction,
 *     {
 *       validator: someFunction,
 *       options: {}
 *     }
 *   ]
 * }
 */

export function uiSchemaValidate(errors, uiSchema, formData, otherData, path = '') {
  const currentData = _.get(path, formData);
  if (uiSchema.items) {
    currentData.forEach((item, index) => {
      uiSchemaValidate(errors, uiSchema.items, formData, otherData, `${path}[${index}]`);
    });
  }
  if (uiSchema.properties) {
    Object.keys(uiSchema.properties).forEach((item) => {
      const nextPath = path !== '' ? `${path}.${item}` : item;
      uiSchemaValidate(errors, uiSchema.properties[item], formData, otherData, nextPath);
    });
  }
  const validations = uiSchema['ui:validations'];
  if (validations) {
    validations.forEach(validation => {
      if (typeof validation === 'function') {
        const result = validation(currentData, formData, otherData);
        if (result) {
          _.get(path, errors).addError(result);
        }
      } else {
        const result = validation.validator(currentData, formData, otherData, validation.options);
        if (result) {
          _.get(path, errors).addError(result);
        }
      }
    });
  }

  return errors;
}
