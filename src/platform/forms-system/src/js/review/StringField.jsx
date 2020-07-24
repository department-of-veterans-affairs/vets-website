import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports

import {
  getUiOptions,
  getWidget,
  optionsList,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { getNestedUISchema } from './ReviewFieldTemplate';

/*
 * This is a minimal string field implementation for the
 * review page, so we can pass custom review widgets
 * in the config
 */
export default function StringField(props) {
  const { registry, schema, uiSchema, formData } = props;
  const realUiSchema = getNestedUISchema(uiSchema);
  const uiOptions = getUiOptions(realUiSchema);
  const labels = uiOptions.labels || {};
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);

  let Widget = _.get('ui:reviewWidget', realUiSchema);
  if (!Widget) {
    const defaultWidget = schema.format || (enumOptions ? 'select' : 'text');
    Widget = getWidget(
      schema,
      uiOptions.widget || defaultWidget,
      registry.widgets,
    );
  }

  return (
    <Widget
      options={_.assign(uiOptions, { enumOptions, labels })}
      value={formData}
      {...props}
    />
  );
}
