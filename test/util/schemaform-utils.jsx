import _ from 'lodash/fp';
import Form from 'react-jsonschema-form';
import ReactTestUtils from 'react-dom/test-utils';

import React from 'react';
import SchemaForm from '../../src/js/common/schemaform/SchemaForm';

import {
  replaceRefSchemas,
  updateSchemaAndData
} from '../../src/js/common/schemaform/formState';

function getDefaultData(schema) {
  if (schema.type === 'array') {
    return [];
  } else if (schema.type === 'object') {
    return {};
  }

  return undefined;
}
export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    const { data, uiSchema } = props;

    const definitions = _.assign(props.definitions || {}, props.schema.definitions);
    const schema = replaceRefSchemas(props.schema, definitions);

    const {
      data: newData,
      schema: newSchema
    } = updateSchemaAndData(schema, uiSchema, data || getDefaultData(schema));

    this.state = {
      formData: newData,
      schema: newSchema,
      uiSchema
    };
  }
  handleChange = (data) => {
    const {
      schema,
      uiSchema
    } = this.state;

    const {
      data: newData,
      schema: newSchema
    } = updateSchemaAndData(schema, uiSchema, data);

    this.setState({
      formData: newData,
      schema: newSchema,
      uiSchema
    });
  }
  render() {
    const { schema, uiSchema, formData } = this.state;

    return (
      <SchemaForm
          safeRenderCompletion
          reviewMode={this.props.reviewMode}
          name="test"
          title="test"
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          onChange={this.handleChange}
          onSubmit={this.props.onSubmit}/>
    );
  }
}

export function submitForm(form) {
  ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
    preventDefault: f => f
  });
}
