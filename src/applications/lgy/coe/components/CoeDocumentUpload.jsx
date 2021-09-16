import React, { useReducer } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import { scrollToFirstError } from 'platform/utilities/ui';

import { ACTIONS, DOCUMENT_TYPES, FILE_TYPES } from '../constants';
import { isValidFileType, isNotBlank, validateIfDirty } from '../validations';

const initialState = {
  documentType: DOCUMENT_TYPES[0],
  documentDescription: {
    dirty: false,
    value: '',
  },
  errorMessage: null,
  files: [],
};

const {
  DOC_TYPE,
  DOC_DESC,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAIL,
  FILE_UPLOAD_PENDING,
  FORM_SUBMIT_FAIL,
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
        documentDescription: {
          dirty: false,
          value: '',
        },
        errorMessage: null,
      };
    case FILE_UPLOAD_PENDING:
      return { ...state, errorMessage: null };
    case FORM_SUBMIT_FAIL:
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

  const errorMsgClass = errorMessage ? 'vads-u-padding-left--1p5' : null;
  const disabledOnEmptyDescClass =
    documentType === 'Other' && !isNotBlank(documentDescription.value)
      ? 'file-input-disabled'
      : null;

  const onSelectChange = e => {
    dispatch({ type: DOC_TYPE, documentType: e?.value });
  };

  const onTextInputValueChange = e => {
    dispatch({
      type: DOC_DESC,
      documentDescription: { dirty: true, value: e?.value },
    });
  };

  const onUploadFile = async uploadedFiles => {
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
    if (documentDescription.value !== '') {
      file.documentDescription = documentDescription.value;
    }
    dispatch({ type: FILE_UPLOAD_SUCCESS, file });
  };

  const onDeleteFile = idx => {
    const newFiles = state.files.filter((file, index) => index !== idx);
    dispatch({ type: DELETE_FILE, files: newFiles });
  };

  const onSubmit = () => {
    if (!files.length) {
      dispatch({
        type: FORM_SUBMIT_FAIL,
        errorMessage: 'Please choose a file to upload',
      });
      setTimeout(scrollToFirstError);
    }
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
        buttonText="Upload this document"
        onChange={onUploadFile}
        name="fileUpload"
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        errorMessage={errorMessage}
      />
      <button className="vads-u-margin-top--3 usa-button" onClick={onSubmit}>
        Submit uploaded documents
      </button>
    </>
  );
};
