export const getFullNameString = fullName => {
  const { first, middle, last } = fullName;
  let fullNameString = `${first}`;

  if (middle) {
    fullNameString += ` ${middle}`;
  }

  return `${fullNameString} ${last}`;
};

export const camelCaseToSnakeAllCaps = str => {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toUpperCase();
};

export const snakeAllCapsToCamelCase = str => {
  const camelCaseArr = str.split('_').map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }

    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return camelCaseArr.join('');
};

export const getLabelsFromConstants = (constants = {}) => {
  // convert a radio-button-labels constants object (with SNAKE_CASE keys) to
  // an labels object (with camelCase keys)
  // for uiSchema['ui:options'].labels

  const labels = {};

  Object.keys(constants).forEach(key => {
    labels[snakeAllCapsToCamelCase(key)] = constants[key];
  });

  return labels;
};

export const getEnumsFromConstants = (constants = {}) => {
  // convert a radio-button-labels constants object (with SNAKE_CASE keys) to
  // an enums array of camelCase key-strings
  // for schema.properties.<text-field>.enum [field type should be 'string']

  const enums = [];

  Object.keys(constants).forEach(key => {
    enums.push(snakeAllCapsToCamelCase(key));
  });

  return enums;
};
