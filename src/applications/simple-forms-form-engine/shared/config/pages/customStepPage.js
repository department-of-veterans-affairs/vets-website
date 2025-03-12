import { kebabCase } from 'lodash';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { textArea, textInput } from '../components';

/** @returns {[SchemaOptions, UISchemaOptions]} */
const selectSchemas = component => {
  if (component.type === 'digital_form_text_area') {
    return textArea(component);
  }

  return textInput(component);
};

/** @returns {PageSchema} */
export default ({ components, bodyText, pageTitle }) => {
  const schema = { properties: {}, required: [], type: 'object' };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle, bodyText),
  };

  components.forEach(component => {
    // This assumes every component on a page will have a unique label.
    const key = `page${component.id}`;

    const [componentSchema, componentUiSchema] = selectSchemas(component);

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
