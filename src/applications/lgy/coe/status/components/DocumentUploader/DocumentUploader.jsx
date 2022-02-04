import React, { useCallback, useReducer } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import Select from '@department-of-veterans-affairs/component-library/Select';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

import { scrollToFirstError } from 'platform/utilities/ui';

import { ACTIONS } from '../../../shared/constants';
import { DOCUMENT_TYPES, FILE_TYPES } from '../../constants';
import {
  isValidFileType,
  isNotBlank,
  validateIfDirty,
} from '../../validations';
import FileList from './FileList';

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

const DocumentUploader = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { documentType, documentDescription, errorMessage, files } = state;

  const errorMsgClass = errorMessage ? 'vads-u-padding-left--1p5' : null;
  const disabledOnEmptyDescClass =
    documentType === 'Other' && !isNotBlank(documentDescription.value)
      ? 'file-input-disabled'
      : null;

  const onSelectChange = useCallback(e => {
    dispatch({ type: DOC_TYPE, documentType: e?.value });
  }, []);

  const onTextInputValueChange = useCallback(e => {
    dispatch({
      type: DOC_DESC,
      documentDescription: { dirty: true, value: e?.value },
    });
  }, []);

  const onUploadFile = useCallback(
    async uploadedFiles => {
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
    },
    [documentDescription.value, documentType],
  );

  const onDeleteClick = useCallback(
    idx => {
      const newFiles = state.files.filter((_file, index) => index !== idx);
      dispatch({ type: DELETE_FILE, files: newFiles });
    },
    [state.files],
  );

  const onSubmit = useCallback(
    () => {
      if (!files.length) {
        dispatch({
          type: FORM_SUBMIT_FAIL,
          errorMessage: 'Please choose a file to upload',
        });
        setTimeout(scrollToFirstError);
      }
    },
    [files],
  );

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve emailed you a notification letter about documentation for your COE
        request. Please send us all the documents listed so we can make a
        decision about your request.
      </p>
      <FileList files={files} onClick={onDeleteClick} />
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
      <button
        className="vads-u-margin-top--3 usa-button"
        onClick={onSubmit}
        type="button"
      >
        Submit uploaded documents
      </button>
      <p>
        <strong>Note:</strong> After you upload documents, it will take up to 5
        days for us to review them
      </p>
    </>
  );
};

export default DocumentUploader;
