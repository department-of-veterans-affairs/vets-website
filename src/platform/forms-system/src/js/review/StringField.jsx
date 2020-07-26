import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import { checkForNestedUISchema } from '../helpers';
import {
  getUiOptions,
  getWidget,
  optionsList,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

/*
 * This is a minimal string field implementation for the
 * review page, so we can pass custom review widgets
 * in the config
 */
export default function StringField(props) {
  const {
    registry = getDefaultRegistry(),
    schema,
    uiSchema,
    formData,
    children,
  } = props;
  const realUiSchema = checkForNestedUISchema(uiSchema);
  const uiOptions = getUiOptions(realUiSchema);
  const labels = uiOptions.labels || {};
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);
  let Widget =
    _.get('ui:reviewWidget', realUiSchema) || _.get('widget', uiOptions);

  if (!Widget) {
    if (schema.type !== 'object' && schema.type !== 'array') {
      const defaultWidget = schema.format || (enumOptions ? 'select' : 'text');
      Widget = getWidget(schema, defaultWidget, registry.widgets);
    } else {
      return children;
    }
  }

  return (
    <Widget
      options={_.assign(uiOptions, { enumOptions, labels })}
      value={formData}
      {...props}
    />
  );
}
