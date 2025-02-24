import { camelCase, kebabCase } from 'lodash';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export default ({ components, bodyText, pageTitle }) => {
  const schema = { properties: {}, required: [] };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle, bodyText),
  };

  components.forEach(component => {
    // This assumes every component on a page will have a unique label.
    const key = camelCase(component.label);

    schema.properties[key] = {};
    uiSchema[key] = {};

    if (component.required) {
      schema.required.push(key);
    }
  });

  return {
    // This assumes every page title within a form is unique.
    path: kebabCase(pageTitle),
    schema,
    title: pageTitle,
    uiSchema,
  };
};
