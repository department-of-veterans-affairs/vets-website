import React from 'react';
import PropTypes from 'prop-types';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

const ContactInfoForm = props => (
  <SchemaForm
    addNameAttribute
    // `name` and `title` are required by SchemaForm, but are only used
    // internally by the SchemaForm component
    name="Contact Info Form"
    title="Contact Info Form"
    schema={props.formSchema}
    uiSchema={props.uiSchema}
    onChange={data => {
      props.onUpdateFormData(data, props.formSchema, props.uiSchema);
    }}
    onSubmit={e => props.onSubmit(e)}
    data={props.formData}
  >
    {props.children}
  </SchemaForm>
);

ContactInfoForm.propTypes = {
  formData: PropTypes.object.isRequired,
  formSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
};

export default ContactInfoForm;
