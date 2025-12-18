import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { idFormSchema, idFormUiSchema } from './idForm';

const IdentityForm = ({ data, onChange, onSubmit }) => {
  const schemaFormFooter = (
    <ProgressButton
      buttonClass="vads-u-width--auto idform-submit-button"
      buttonText="Continue to the application"
      afterText="»"
      submitButton
    />
  );

  return (
    <div className="vads-u-margin-top--2p5">
      <SchemaForm
        name="Identity Form"
        title="Identity Form"
        schema={idFormSchema}
        uiSchema={idFormUiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        data={data}
      >
        {schemaFormFooter}
      </SchemaForm>
    </div>
  );
};

IdentityForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default IdentityForm;
