// Format JSON-schema error messages

// Change error message from `requires propert "someCamelCasedProperty"` to
// `Missing some camel cased property`. It's using the schema property name,
// which isn't ideal, but the uiSchema may have an empty title and/or
// description
export const formatErrors = message => {
  const formattedMessage = message
    .replace('requires property "', '')
    .slice(0, -1)
    .replace('view:', '')
    .replace(/[A-Z]/g, str => ` ${str.toLowerCase()}`);
  return `Missing ${formattedMessage}`;
};
