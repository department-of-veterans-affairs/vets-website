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
  replaceRefSchemas
} from '../../src/js/common/schemaform/helpers';

export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    const { state, uiSchema } = props;
    const pageData = props.data;
    const formData = _.merge(props.formData, pageData);

    const definitions = _.merge(props.definitions || {}, props.schema.definitions);
    let schema = replaceRefSchemas(props.schema, definitions);
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
      uiSchema,
      formData
    };
  }
  handleChange = (data) => {
    // console.log('DefinitionTester -> handleChange -> data:', data);
    const state = this.props.state;
    const uiSchema = this.state.uiSchema;
    const formData = _.merge(this.props.formData, data);
    let schema = updateRequiredFields(this.state.schema, uiSchema, formData);
    // Update the schema with any fields that are now hidden because of the data change
    schema = setHiddenFields(schema, uiSchema, formData);
    // Update the schema with any general updates based on the new data
    schema = updateSchemaFromUiSchema(schema, uiSchema, data, state);
    // Remove any data that's now hidden in the schema
    const newData = removeHiddenData(schema, data);

    this.setState({
      data: newData,
      schema,
      uiSchema,
      formData
    });
  }
  render() {
    const { schema, uiSchema, data, formData } = this.state;
    // console.log('DefinitionTester -> data:', data);
    // console.log('DefinitionTester -> formData:', formData);

    return (
      <SchemaForm
          safeRenderCompletion
          reviewMode={this.props.reviewMode}
          name="test"
          title="test"
          schema={schema}
          uiSchema={uiSchema}
          pageData={data}
          formData={formData}
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

/**
 * Wraps the schema and uiSchema for testing purposes.
 *
 * There's no reason for arrays to be the root schema, so this utility function
 *  wraps them in an object so we can test them properly.
 */
export function wrapSchemas(schema, uiSchema, propertyName = 'originalSchema') {
  return {
    schema: {
      type: 'object',
      properties: {
        [propertyName]: schema
      }
    },
    uiSchema: {
      [propertyName]: uiSchema
    }
  };
}
