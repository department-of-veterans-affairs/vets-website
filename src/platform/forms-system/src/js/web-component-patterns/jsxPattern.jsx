/**
 * @param {string | import("react").JSXElementConstructor} [Jsx]
 * @returns {JSXElementConstructor}
 */
export const jsxUI = Jsx => {
  return {
    'ui:title': '',
    'ui:description': Jsx,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const jsxSchema = () => {
  return {
    type: 'object',
    properties: {},
  };
};
