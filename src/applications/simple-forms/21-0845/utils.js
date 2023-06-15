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
  // convert a CONSTANTS object (with SNAKE_CASE keys) to
  // an labels object (with camelCase keys)

  const labels = {};

  Object.keys(constants).forEach(key => {
    labels[snakeAllCapsToCamelCase(key)] = constants[key];
  });

  return labels;
};
