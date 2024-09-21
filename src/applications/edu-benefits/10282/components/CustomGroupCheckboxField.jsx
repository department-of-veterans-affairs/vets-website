import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CustomGroupCheckboxField = ({
  uiSchema,
  idSchema,
  formData,
  onChange,
}) => {
  const title = uiSchema['ui:title'];
  const description = uiSchema['ui:description'];
  const { labels } = uiSchema['ui:options'];

  const [selectedOptions, setSelectedOptions] = useState(formData || []);

  const handleChange = event => {
    const { value, checked } = event.target;
    let updatedOptions;
    if (checked) {
      updatedOptions = [...selectedOptions, value];
    } else {
      updatedOptions = selectedOptions.filter(option => option !== value);
    }
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div>
      {title && <p className="vads-u-margin-bottom--0">{title}</p>}
      {description && (
        <p className="vads-u-color--gray-medium vads-u-margin-top--0 vads-u-margin-bottom--0">
          {description}
        </p>
      )}
      <div className="vads-u-margin-top--neg5">
        <VaCheckboxGroup onVaChange={handleChange} error={null}>
          {labels.map((label, index) => (
            <va-checkbox
              key={label}
              data-index={index}
              id={`${idSchema.$id}_${index}`}
              label={label}
              checked={selectedOptions.includes(label)}
            />
          ))}
        </VaCheckboxGroup>
      </div>
    </div>
  );
};

CustomGroupCheckboxField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object,
  idSchema: PropTypes.object,
  formData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formContext: PropTypes.object,
};

export default CustomGroupCheckboxField;
