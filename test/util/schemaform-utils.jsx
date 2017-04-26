import _ from 'lodash/fp';
import Form from 'react-jsonschema-form';
import ReactTestUtils from 'react-addons-test-utils';

import React from 'react';
import SchemaForm from '../../src/js/common/schemaform/SchemaForm';

import {
  replaceRefSchemas,
  updateSchemaAndData
} from '../../src/js/common/schemaform/formState';

export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    const { state, uiSchema } = props;
    const pageData = props.data;
    const formData = props.schema.type === 'array'
      ? pageData || []
      : _.merge(props.formData, pageData);

    const definitions = _.merge(props.definitions || {}, props.schema.definitions);
    const schema = replaceRefSchemas(props.schema, definitions);

    const { data: newData, schema: newSchema } = updateSchemaAndData(schema, uiSchema, formData, pageData, state);

    this.state = {
      data: newData,
      schema: newSchema,
      uiSchema,
      formData
    };
  }
  handleChange = (data) => {
    // console.log('DefinitionTester -> handleChange -> data:', data);
    const state = this.props.state;
    const uiSchema = this.state.uiSchema;
    const formData = this.state.schema.type === 'array'
      ? data
      : _.merge(this.props.formData, data);

    const { data: newData, schema } = updateSchemaAndData(this.state.schema, uiSchema, formData, data, state);

    this.setState({
      data: newData,
      schema,
      uiSchema,
      formData
    });
  }
  render() {
    const { schema, uiSchema, data, formData } = this.state;

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
