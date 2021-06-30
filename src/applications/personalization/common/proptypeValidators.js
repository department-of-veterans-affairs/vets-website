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
