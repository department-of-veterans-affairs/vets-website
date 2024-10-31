import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { issueLabelMap } from '../helpers';

const CustomGroupCheckboxTileField = ({
  uiSchema,
  idSchema,
  formData,
  onChange,
}) => {
  const sanitizedFormData = formData;
  const labels = uiSchema['ui:options']?.labels || [];
  const handleChange = event => {
    const { name, checked } = event.target;

    const newFormData = { ...sanitizedFormData, [name]: checked };

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
            id={idSchema[label]?.$id || ''}
            label={issueLabelMap[label]?.label}
            checkbox-description={issueLabelMap[label]?.description}
            value={label}
            name={label}
            checked={sanitizedFormData[label]}
            vaChange={handleChange}
            tile
          />
        ))}
      </VaCheckboxGroup>
    </div>
  );
};

CustomGroupCheckboxTileField.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

CustomGroupCheckboxTileField.defaultProps = {
  formData: [],
  idSchema: {},
  uiSchema: { 'ui:options': { labels: [] } },
};

export default CustomGroupCheckboxTileField;
