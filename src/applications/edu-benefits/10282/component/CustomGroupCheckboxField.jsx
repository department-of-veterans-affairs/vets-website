import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CustomGroupCheckboxField = ({
  uiSchema,
  idSchema,
  formData = [],
  onChange,
}) => {
  useEffect(
    () => {
      console.log('idSchema:', idSchema);
      console.log('formData:', formData);
      console.log('uiSchema:', uiSchema);
    },
    [idSchema, formData, uiSchema],
  );
  const sanitizedFormData = Array.isArray(formData)
    ? formData.filter(item => item !== undefined)
    : [];

  const labels = uiSchema['ui:options'].labels || [];

  const handleChange = event => {
    const { value, checked } = event.target;
    let newFormData;

    if (checked) {
      // Add the value if it's not already in the array
      newFormData = sanitizedFormData
        ? [...new Set([...sanitizedFormData, value])]
        : [value];
    } else {
      // Remove the value from the array
      newFormData = sanitizedFormData.filter(item => item !== value);
    }

    onChange(newFormData);
  };

  return (
    <div className="vads-u-margin-top--2">
      <VaCheckboxGroup onVaChange={handleChange} error={null}>
        {labels.map((label, index) => (
          <va-checkbox
            key={`${label}-${index}`}
            data-index={index}
            id={`${idSchema.$id}_${index}`}
            label={label}
            value={label}
            checked={sanitizedFormData?.includes(label)}
          />
        ))}
      </VaCheckboxGroup>
    </div>
  );
};

CustomGroupCheckboxField.propTypes = {
  idSchema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.array,
};

export default CustomGroupCheckboxField;
