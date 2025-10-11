import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * File upload field component using VA web components
 * Provides file input with validation and file type restrictions
 *
 * @caution va-file-input is marked "Use with Caution" in VA Design System - test browser compatibility
 *
 * @component
 * @see [VA File Input](https://design.va.gov/components/form/file-input)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the file input
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {Function} props.onChange - Change handler function (name, files) => void
 * @param {boolean} [props.required=false] - Whether file upload is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {string} [props.accept='.pdf,.jpg,.jpeg,.png'] - Accepted file types
 * @param {number} [props.maxSize=5242880] - Maximum file size in bytes (default 5MB)
 * @param {string} [props.error] - External error message to display
 * @returns {JSX.Element} VA file input component with validation
 */
export const FileUploadField = ({
  name,
  label,
  schema,
  onChange,
  required = false,
  hint = 'Upload DD-214 or other discharge papers',
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5242880, // 5MB default
  error: externalError,
  ...props
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const {
    validateField,
    touchField,
    error: validationError,
    isValidating,
  } = useFieldValidation(schema);

  const displayError = externalError || validationError;

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(k)),
      sizes.length - 1,
    );
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  };

  const handleFileChange = e => {
    const files = e?.detail?.files || e?.target?.files || [];
    const fileArray = Array.from(files);

    // Validate file size
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const fileName = oversizedFiles[0].name;
      const maxSizeFormatted = formatFileSize(maxSize);
      validateField(fileArray, true, {
        message: `File "${fileName}" exceeds maximum size of ${maxSizeFormatted}`,
      });
      return;
    }

    setUploadedFiles(fileArray);
    onChange(name, fileArray);
  };

  const handleRemoveFile = index => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(name, newFiles);
  };

  const handleBlur = () => {
    touchField();
    validateField(uploadedFiles, true);
  };

  return (
    <div className="file-upload-field vads-u-margin-bottom--2">
      <va-file-input
        {...props}
        name={name}
        label={label}
        accept={accept}
        required={required}
        error={displayError}
        hint={`${hint} (Maximum file size: ${formatFileSize(maxSize)})`}
        onVaChange={handleFileChange}
        onBlur={handleBlur}
        aria-describedby={isValidating ? `${name}-validating` : undefined}
      />

      {uploadedFiles.length > 0 && (
        <div className="vads-u-margin-top--2">
          <h4 className="vads-u-font-size--h5">Uploaded files:</h4>
          <ul className="vads-u-margin-top--1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="vads-u-margin-bottom--1">
                <span className="vads-u-margin-right--1">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <va-button
                  type="button"
                  secondary
                  class="vads-u-padding--0p5"
                  onClick={() => handleRemoveFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </va-button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FileUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  maxSize: PropTypes.number,
  required: PropTypes.bool,
};
