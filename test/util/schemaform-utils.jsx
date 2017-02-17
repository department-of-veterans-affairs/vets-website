import React from 'react';
import SchemaForm from '../../src/js/common/schemaform/SchemaForm';

import {
  setHiddenFields,
  removeHiddenData,
  updateRequiredFields,
  updateSchemaFromUiSchema
} from '../../src/js/common/schemaform/helpers';

export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      schema: props.schema,
      uiSchema: props.uiSchema
    };
  }
  handleChange = (data) => {
    const state = this.props.state;
    const uiSchema = this.state.uiSchema;
    let schema = updateRequiredFields(this.state.schema, uiSchema, data, state);
    // Update the schema with any fields that are now hidden because of the data change
    schema = setHiddenFields(schema, uiSchema, data, state);
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
