import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInputMultiple,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const NewAddFilesForm = ({ onChange, onSubmit, required }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileChange = event => {
    const { state } = event.detail;
    setFiles(state || []);

    // Clear errors when files are added
    if (state && state.length > 0) {
      setErrors([]);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = () => {
    if (required && files.length === 0) {
      setErrors(['Please select a file first']);
      return;
    }

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>
      <VaFileInputMultiple
        hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
        label="Upload additional evidence"
        onVaMultipleChange={handleFileChange}
        errors={errors}
      />
      <VaButton text="Submit documents for review" onClick={handleSubmit} />
    </>
  );
};

NewAddFilesForm.propTypes = {
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default NewAddFilesForm;
