export const numberBetween = (min, max) => {
  return (props, propName, componentName) => {
    const prop = props[propName];
    if (typeof prop !== 'number' || prop < min || prop > max) {
      return new Error(
        `Prop ${propName} must be a number between ${min} and ${max} on ${componentName}`,
      );
    }
    return null;
  };
};

// validates that a prop is a number between min and max, or null or undefined
// this allows a default to be used if the prop is not provided
export const optionalNumberBetween = (min, max) => {
  return (props, propName, componentName) => {
    const prop = props[propName];
    if (typeof prop !== 'number' && prop !== null && prop !== undefined) {
      return new Error(
        `Prop ${propName} must be a number between ${min} and ${max} on ${componentName}`,
      );
    }
    return null;
  };
};
