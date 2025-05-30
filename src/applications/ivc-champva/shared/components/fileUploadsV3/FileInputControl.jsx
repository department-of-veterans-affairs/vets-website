import React from 'react';
import PropTypes from 'prop-types';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Wrapper around VaFileInputMultiple with a data-testid set.
 */
const FileInputControl = ({ mappedProps, errors, value, onChange }) => {
  return (
    <VaFileInputMultiple
      {...mappedProps}
      errors={errors}
      value={value}
      onVaMultipleChange={onChange}
      data-testid="file-input-control"
    />
  );
};

FileInputControl.propTypes = {
  // eslint-disable-next-line react/sort-prop-types
  onChange: PropTypes.func.isRequired,
  mappedProps: PropTypes.object.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export default FileInputControl;
