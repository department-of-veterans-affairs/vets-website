import _ from 'lodash/fp';
import Form from 'react-jsonschema-form';
import ReactTestUtils from 'react-addons-test-utils';

import React from 'react';
import SchemaForm from '../../src/js/common/schemaform/SchemaForm';

import {
  setHiddenFields,
  removeHiddenData,
  updateRequiredFields,
  updateSchemaFromUiSchema,
  replaceRefSchemas,
  updateItemsSchema
} from '../../src/js/common/schemaform/helpers';

export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    const { state, uiSchema } = props;
    const pageData = props.data;
    const formData = _.merge(props.formData, pageData);

    const definitions = _.merge(props.definitions || {}, props.schema.definitions);
    let schema = replaceRefSchemas(props.schema, definitions);
    schema = updateItemsSchema(schema, formData);
    schema = updateRequiredFields(schema, uiSchema, formData);
    // Update the schema with any fields that are now hidden because of the data change
    schema = setHiddenFields(schema, uiSchema, formData);
    // Update the schema with any general updates based on the new data
    schema = updateSchemaFromUiSchema(schema, uiSchema, pageData, state);
    // Remove any data that's now hidden in the schema
    const newData = removeHiddenData(schema, pageData);

    this.state = {
      data: newData,
      schema,
      uiSchema
    };
  }
  handleChange = (data) => {
    const state = this.props.state;
    const uiSchema = this.state.uiSchema;
    const formData = _.merge(this.props.formData, data);
    let schema = updateItemsSchema(this.state.schema, formData);
    schema = updateRequiredFields(schema, uiSchema, formData);
    // Update the schema with any fields that are now hidden because of the data change
    schema = setHiddenFields(schema, uiSchema, formData);
    // Update the schema with any general updates based on the new data
    schema = updateSchemaFromUiSchema(schema, uiSchema, data, state);
    // Remove any data that's now hidden in the schema
    const newData = removeHiddenData(schema, data);

    this.setState({
      data: newData,
      schema,
      uiSchema
    });
  }
  render() {
    const { schema, uiSchema, data } = this.state;
    return (
      <SchemaForm
          safeRenderCompletion
          reviewMode={this.props.reviewMode}
          name="test"
          title="test"
          schema={schema}
          uiSchema={uiSchema}
          data={data}
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
