import { camelCase, kebabCase } from 'lodash';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import textInput from '../components/textInput';

/** @returns {PageSchema} */
export default ({ components, bodyText, pageTitle }) => {
  const schema = { properties: {}, required: [], type: 'object' };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle, bodyText),
  };

  components.forEach(component => {
    // This assumes every component on a page will have a unique label.
    const key = camelCase(component.label);

    // This will eventually become a switch statement or its own function as
    // more components get added.
    const [componentSchema, componentUiSchema] = textInput(component);

    schema.properties[key] = componentSchema;
    uiSchema[key] = componentUiSchema;

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
