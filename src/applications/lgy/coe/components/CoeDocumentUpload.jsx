import React, { useState } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import { DOCUMENT_TYPES } from '../constants';

export const CoeDocumentUpload = () => {
  const [formData, setFormData] = useState({
    documentType: DOCUMENT_TYPES[0],
    documentDescription: '',
  });

  const [files, setFiles] = useState([]);

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

  const onUploadFile = e => {
    const newFiles = [...files, e[0]];
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
        >
          <p>{file.name}</p>
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
      <FileInput buttonText="Upload this document" onChange={onUploadFile} />
    </>
  );
};
