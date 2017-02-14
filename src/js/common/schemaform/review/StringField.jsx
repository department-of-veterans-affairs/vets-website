import React from 'react';
import _ from 'lodash/fp';

import {
  getUiOptions,
  getWidget,
  optionsList,
  defaultFieldValue
} from 'react-jsonschema-form/lib/utils';

export default function StringField(props) {
  const { registry, schema, uiSchema, formData } = props;
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);

  let Widget = _.get('reviewWidget', uiSchema);
  if (!Widget) {
    const defaultWidget = schema.format || (enumOptions ? 'select' : 'text');
    const widget = getUiOptions(uiSchema).defaultWidget || defaultWidget;
    Widget = getWidget(schema, widget, registry.widgets);
  }

  return (
    <Widget
        options={{ enumOptions }}
        value={defaultFieldValue(formData, schema)}
        {...props}/>
  );
}
