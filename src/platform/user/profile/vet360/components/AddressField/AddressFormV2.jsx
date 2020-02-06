import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

/**
 * Input component for an address.
 */
class AddressFormV2 extends React.Component {
  render() {
    return (
      <SchemaForm
        // `name` and `title` are required by SchemaForm, but are only used
        // internally by the SchemaForm component
        name="Address Form"
        title="Address Form"
        schema={this.props.formSchema}
        uiSchema={this.props.uiSchema}
        onChange={data => {
          this.props.onUpdateFormData(
            data,
            this.props.formSchema,
            this.props.uiSchema,
          );
        }}
        onSubmit={e => this.props.onSubmit(e)}
        data={this.props.address}
      >
        {this.props.children}
      </SchemaForm>
    );
  }
}

export default AddressFormV2;
