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
