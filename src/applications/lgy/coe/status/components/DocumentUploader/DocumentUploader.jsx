import React, { useCallback, useReducer } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { submitToAPI } from './submit';
import { addFile } from './addFile';
import { ACTIONS } from '../../../shared/constants';
import { DOCUMENT_TYPES, FILE_TYPES } from '../../constants';
import { isNotBlank, validateIfDirty } from '../../validations';
import FileList from './FileList';
import { reducer, initialState } from './reducer';

const DocumentUploader = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = localStorage.getItem('csrfToken');
  const {
    documentType,
    documentDescription,
    errorMessage,
    files,
    successMessage,
    submissionPending,
  } = state;

  const reader = new FileReader();

  const errorMsgClass = errorMessage ? 'vads-u-padding-left--1p5' : null;
  const disabledOnEmptyDescClass =
    documentType === 'Other' && !isNotBlank(documentDescription.value)
      ? 'file-input-disabled'
      : null;

  const onSelectChange = useCallback(e => {
    dispatch({ type: ACTIONS.DOC_TYPE, documentType: e?.value });
  }, []);

  const onTextInputValueChange = useCallback(e => {
    dispatch({
      type: ACTIONS.DOC_DESC,
      documentDescription: { dirty: true, value: e?.value },
    });
  }, []);

  const onUploadFile = useCallback(
    async uploadedFiles => {
      addFile(uploadedFiles[0], documentType, dispatch, ACTIONS, reader);
    },
    [documentDescription.value, documentType],
  );

  const onDeleteClick = useCallback(
    idx => {
      const newFiles = state.files.filter((_file, index) => index !== idx);
      dispatch({ type: ACTIONS.DELETE_FILE, files: newFiles });
    },
    [state.files],
  );

  const onSubmit = () => {
    submitToAPI(files, token, dispatch, ACTIONS);
  };

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve emailed you a notification letter about documentation for your COE
        request. Please send us all the documents listed so we can make a
        decision about your request.
      </p>
      {submissionPending ? (
        <va-loading-indicator label="Loading" message="Sending your files..." />
      ) : (
        <FileList files={files} onClick={onDeleteClick} />
      )}
      {successMessage ? (
        <va-alert status="success" visible>
          <h3 slot="headline">Your files have been uploaded</h3>
        </va-alert>
      ) : null}
      <div
        className={
          documentType === 'Other'
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
          value={{ dirty: false, value: documentType }}
        />
        {documentType === 'Other' && (
          <TextInput
            label="Document description"
            name="document_description"
            field={documentDescription}
            required={documentType === 'Other'}
            errorMessage={
              validateIfDirty(documentDescription, isNotBlank)
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
        errorMessage={errorMessage}
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
