import React, { useState } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import { DOCUMENT_TYPES, FILE_TYPES } from '../constants';
import { isValidFileType } from '../validations';

// TODO:
// 1. Uploading a file needs visual feedback as well as SR feedback
// 2. Deleting a file should provide SR confirmation of succesful deletion
// 3. formData should be added as properties to respective files uploaded

export const CoeDocumentUpload = () => {
  const [formData, setFormData] = useState({
    documentType: DOCUMENT_TYPES[0],
    documentDescription: '',
  });

  const [files, setFiles] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  const onSelectChange = e => {
    setFormData({
      ...formData,
      documentType: e?.value,
    });
  };

  const onTextInputValueChange = e => {
    setFormData({
      ...formData,
      documentDescription: e?.value,
    });
  };

  const onUploadFile = uploadedFiles => {
    setErrorMessage(null);
    if (!isValidFileType(uploadedFiles[0])) {
      setErrorMessage(
        'Please choose a file from one of the accepted file types.',
      );
      return;
    }
    const newFiles = [...files, uploadedFiles[0]];
    setFiles(newFiles);
  };

  const onDeleteFile = idx => {
    const newFiles = files.filter((file, index) => index !== idx);
    setFiles(newFiles);
  };

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve sent a notification letter or email about documentation for your
        COE application. Please send us all the documents listed so we can make
        a decision about your application.
      </p>
      {files.map((file, index) => (
        <div
          className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2 vads-u-margin-y--1"
          key={index}
          id={index}
        >
          <p>
            <strong>{file.name}</strong>
          </p>
          <button
            onClick={() => onDeleteFile(index)}
            className="usa-button-secondary vads-u-background-color--white vads-u-margin-top--0"
          >
            Delete file
          </button>
        </div>
      ))}
      <Select
        required
        name="document_type"
        label="Select a document to upload"
        options={DOCUMENT_TYPES}
        onValueChange={onSelectChange}
        value={{ dirty: false, value: formData.documentType }}
      />
      {formData.documentType === 'Other' && (
        <TextInput
          label="Document description"
          name="document_description"
          field={{ dirty: false, value: formData.documentDescription }}
          required={formData.documentType === 'Other'}
          onValueChange={onTextInputValueChange}
        />
      )}
      <FileInput
        additionalClass={errorMessage ? 'vads-u-padding-left--1p5' : null}
        additionalErrorClass="vads-u-margin-bottom--1"
        buttonText="Upload this document"
        onChange={onUploadFile}
        name="fileUpload"
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        errorMessage={errorMessage}
      />
    </>
  );
};
