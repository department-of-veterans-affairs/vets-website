import React, { useReducer } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import { ACTIONS, DOCUMENT_TYPES, FILE_TYPES } from '../constants';
import { isValidFileType } from '../validations';

const initialState = {
  documentType: DOCUMENT_TYPES[0],
  documentDescription: null,
  errorMessage: null,
  files: [],
};

const {
  DOC_TYPE,
  DOC_DESC,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAIL,
  FILE_UPLOAD_PENDING,
  DELETE_FILE,
} = ACTIONS;

const reducer = (state, action) => {
  switch (action.type) {
    case DOC_TYPE:
      return { ...state, documentType: action.documentType };
    case DOC_DESC:
      return { ...state, documentDescription: action.documentDescription };
    case FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        files: [...state.files, action.file],
        documentType: DOCUMENT_TYPES[0],
        errorMessage: null,
      };
    case FILE_UPLOAD_PENDING:
      return { ...state, errorMessage: null };
    case FILE_UPLOAD_FAIL:
      return { ...state, errorMessage: action.errorMessage };
    case DELETE_FILE:
      return { ...state, files: action.files };
    default:
      return state;
  }
};

export const CoeDocumentUpload = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { documentType, documentDescription, errorMessage, files } = state;

  const onSelectChange = e => {
    dispatch({ type: DOC_TYPE, documentType: e?.value });
  };

  const onTextInputValueChange = e => {
    dispatch({ type: DOC_DESC, documentDescription: e?.value });
  };

  const onUploadFile = uploadedFiles => {
    dispatch({ type: FILE_UPLOAD_PENDING });
    if (!isValidFileType(uploadedFiles[0])) {
      dispatch({
        type: FILE_UPLOAD_FAIL,
        errorMessage:
          'Please choose a file from one of the accepted file types.',
      });
      return;
    }
    const file = uploadedFiles[0];
    file.documentType = documentType;
    if (documentDescription) {
      file.documentDescription = documentDescription;
    }
    dispatch({ type: FILE_UPLOAD_SUCCESS, file });
  };

  const onDeleteFile = idx => {
    const newFiles = state.files.filter((file, index) => index !== idx);
    dispatch({ type: DELETE_FILE, files: newFiles });
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
        value={{ dirty: false, value: documentType }}
      />
      {documentType === 'Other' && (
        <TextInput
          label="Document description"
          name="document_description"
          field={{ dirty: false, value: documentDescription }}
          required={documentType === 'Other'}
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
