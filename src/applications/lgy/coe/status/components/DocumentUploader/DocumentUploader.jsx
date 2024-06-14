/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import {
  VaFileInput,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { submitToAPI } from './submit';
import { addFile } from './addFile';
import { DOCUMENT_TYPES, FILE_TYPES } from '../../constants';
import FileList from './FileList';

const DocumentUploader = () => {
  const [state, setState] = useState({
    documentType: '',
    documentDescription: '',
    errorMessage: null,
    files: [],
    successMessage: false,
    submitted: [],
    submissionPending: false,
    token: localStorage.getItem('csrfToken'),
    reader: new FileReader(),
  });

  const onSelectChange = e => {
    setState({ ...state, documentType: e.target.value });
  };

  const onTextInputValueChange = e => {
    setState({
      ...state,
      documentDescription: e.target.value,
    });
  };

  const onUploadFile = async uploadedFiles => {
    if (state.documentType === '') {
      setState({
        ...state,
        errorMessage: 'Choose a document type above.',
      });
      return;
    }
    addFile(uploadedFiles[0], state, setState);
  };

  const onDeleteClick = idx => {
    const newFiles = state.files.filter((_file, index) => index !== idx);
    setState({ ...state, files: newFiles });
  };

  const onSubmit = () => {
    submitToAPI(state, setState);
  };

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve emailed you a notification letter about documentation for your COE
        request. Send us all the documents listed so we can make a decision
        about your request.
      </p>
      {state.successMessage ? (
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          show-icon
          status="success"
          visible
        >
          <p>Your documents were successfully uploaded:</p>
          {state.submitted.length ? (
            <ul>
              {state.submitted.map((file, index) => (
                <li key={file.fileName + index}>
                  <strong>{file.fileName}</strong> &ndash; {file.documentType}
                </li>
              ))}
            </ul>
          ) : null}
        </va-alert>
      ) : null}
      {state.submissionPending ? (
        <va-loading-indicator label="Loading" message="Sending your files..." />
      ) : (
        <FileList files={state.files} onClick={onDeleteClick} />
      )}
      <div
        className={
          state.documentType === 'Other'
            ? 'vads-u-padding-left--1p5 vads-u-border-left--5px vads-u-border-color--primary-alt-light'
            : null
        }
      >
        <VaSelect
          required
          name="document_type"
          label="Select a document type to upload"
          onVaSelect={onSelectChange}
          value={state.documentType}
        >
          <option value=""> </option>
          {DOCUMENT_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </VaSelect>
        {state.documentType === 'Other' && (
          <va-text-input
            required
            label="Document description"
            name="document_description"
            onInput={onTextInputValueChange}
            value={state.documentDescription}
          />
        )}
      </div>
      <VaFileInput
        button-text="Upload your document"
        onVaChange={e => onUploadFile(e.detail.files)}
        name="fileUpload"
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        error={state.errorMessage}
      />
      <va-button onClick={onSubmit} text="Submit files" />
      <p>
        <strong>Note:</strong> After you upload documents, it will take up to 5
        days for us to review them
      </p>
    </>
  );
};

export default DocumentUploader;
