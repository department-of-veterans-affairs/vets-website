import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CustomGroupCheckboxField = ({
  uiSchema,
  idSchema,
  formData,
  onChange,
}) => {
  const sanitizedFormData = Array.isArray(formData) ? formData : [];

  const labels = uiSchema['ui:options'].labels || [];

  const handleChange = event => {
    const { value, checked } = event.target;
    let newFormData;

    if (checked) {
      newFormData = [...new Set([...sanitizedFormData, value])];
    } else {
      newFormData = sanitizedFormData.filter(item => item !== value);
    }
    onChange(newFormData);
  };

  return (
    <div className="vads-u-margin-top--2">
      <VaCheckboxGroup error={null}>
        {labels.map((label, index) => (
          <va-checkbox
            key={`${label}-${index}`}
            data-index={index}
            id={`${idSchema?.$id || ''}_${index}`}
            label={label}
            value={label}
            checked={sanitizedFormData?.includes(label)}
            vaChange={handleChange}
          />
        ))}
      </VaCheckboxGroup>
    </div>
  );
};

CustomGroupCheckboxField.propTypes = {
  idSchema: PropTypes.object.isRequired,
  formData: PropTypes.array,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
};

export default CustomGroupCheckboxField;
