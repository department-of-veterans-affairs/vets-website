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

  const labels = uiSchema['ui:options']?.labels || [];
  const handleChange = event => {
    const { name, checked } = event.target;
    let newFormData;

    if (checked) {
      newFormData = [...new Set([...sanitizedFormData, name])];
    } else {
      newFormData = sanitizedFormData.filter(item => item !== name);
    }
    onChange(newFormData);
  };

  return (
    <div className="vads-u-margin-top--neg5">
      <VaCheckboxGroup error={null} onVaChange={handleChange}>
        {labels.map((label, index) => (
          <va-checkbox
            data-testid={`${label}`}
            key={`${label}-${index}`}
            data-index={index}
            id={`${idSchema?.$id || ''}_${index}`}
            label={label}
            value={labels[index]}
            name={label}
            checked={sanitizedFormData.includes(label)}
            vaChange={handleChange}
          />
        ))}
      </VaCheckboxGroup>
    </div>
  );
};

CustomGroupCheckboxField.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

CustomGroupCheckboxField.defaultProps = {
  formData: [],
  idSchema: {},
  uiSchema: { 'ui:options': { labels: [] } },
};

export default CustomGroupCheckboxField;
