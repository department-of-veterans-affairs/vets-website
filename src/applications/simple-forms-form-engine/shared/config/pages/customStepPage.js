import { kebabCase } from 'lodash';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import {
  checkbox,
  date,
  radioButton,
  textArea,
  textInput,
} from '../components';

/**
 * @param {DigitalFormComponent} component
 * @returns {[SchemaOptions, UISchemaOptions]}
 */
const selectSchemas = component => {
  switch (component.type) {
    case 'digital_form_checkbox':
      return checkbox(component);
    case 'digital_form_date_component':
      return date(component);
    case 'digital_form_radio_button':
      return radioButton(component);
    case 'digital_form_text_area':
      return textArea(component);
    default:
      return textInput(component);
  }
};

/** @returns {PageSchema} */
export default ({ components, bodyText, pageTitle }) => {
  const schema = { properties: {}, required: [], type: 'object' };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle, bodyText),
  };

  components.forEach(component => {
    // This assumes every component on a page will have a unique label.
    const key = `component${component.id}`;

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
