import React, { useCallback, useState } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { submitToAPI } from './submit';
import { addFile } from './addFile';
import { DOCUMENT_TYPES, FILE_TYPES } from '../../constants';
import { isNotBlank, validateIfDirty } from '../../validations';
import FileList from './FileList';

const DocumentUploader = () => {
  const token = localStorage.getItem('csrfToken');
  const [state, setState] = useState({
    documentType: '',
    documentDescription: '',
    errorMessage: null,
    files: [],
    successMessage: false,
    submissionPending: false,
    token: localStorage.getItem('csrfToken'),
    reader: new FileReader(),
  });

  const errorMsgClass = state.errorMessage ? 'vads-u-padding-left--1p5' : null;
  const disabledOnEmptyDescClass =
    state.documentType === 'Other' &&
    !isNotBlank(state.documentDescription.value)
      ? 'file-input-disabled'
      : null;

  const onSelectChange = e => {
    setState({ ...state, documentType: e.value });
  };

  const onTextInputValueChange = e => {
    setState({
      ...state,
      documentDescriotion: e.value,
    });
  };

  const onUploadFile = useCallback(
    async uploadedFiles => {
      // If the user selected a document type of other,
      // send the document description they entered as the document type instead
      let theDocType = state.documentType;
      if (theDocType === 'Other') {
        theDocType = state.documentDescription;
      }
      if (theDocType === '') {
        setState({
          ...state,
          errorMessage: 'Please choose a document type above.',
        });
        return;
      }

      addFile(uploadedFiles[0], theDocType, state, setState, state.reader);
    },
    [state.documentType],
  );

  const onDeleteClick = useCallback(
    idx => {
      const newFiles = state.files.filter((_file, index) => index !== idx);
      setState({ ...state, files: newFiles });
    },
    [state.files],
  );

  const onSubmit = () => {
    submitToAPI(state.files, token, state, setState, DOCUMENT_TYPES);
  };

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve emailed you a notification letter about documentation for your COE
        request. Please send us all the documents listed so we can make a
        decision about your request.
      </p>
      {state.submissionPending ? (
        <va-loading-indicator label="Loading" message="Sending your files..." />
      ) : (
        <FileList files={state.files} onClick={onDeleteClick} />
      )}
      {state.successMessage ? (
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          show-icon
          status="success"
          visible
        >
          <div>Your files have been uploaded</div>
        </va-alert>
      ) : null}
      <div
        className={
          state.documentType === 'Other'
            ? 'vads-u-padding-left--1p5 vads-u-border-left--5px vads-u-border-color--primary-alt-light'
            : null
        }
      >
        <Select
          required
          name="document_type"
          label="Select a document to upload"
          options={DOCUMENT_TYPES}
          onValueChange={onSelectChange}
          value={{ dirty: false, value: state.documentType }}
        />
        {state.documentType === 'Other' && (
          <TextInput
            label="Document description"
            name="document_description"
            field={state.documentDescription}
            required={state.documentType === 'Other'}
            errorMessage={
              validateIfDirty(state.documentDescription, isNotBlank)
                ? null
                : 'Please provide a description'
            }
            onValueChange={onTextInputValueChange}
          />
        )}
      </div>
      <FileInput
        additionalClass={`${errorMsgClass} ${disabledOnEmptyDescClass}`}
        additionalErrorClass="vads-u-margin-bottom--1"
        buttonText="Upload your document"
        onChange={onUploadFile}
        name="fileUpload"
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        errorMessage={state.errorMessage}
      />
      <button onClick={onSubmit}>Submit files</button>
      <p>
        <strong>Note:</strong> After you upload documents, it will take up to 5
        days for us to review them
      </p>
    </>
  );
};

export default DocumentUploader;
