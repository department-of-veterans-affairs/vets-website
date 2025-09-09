import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  VaDate,
  VaAlert,
  VaFileInputMultiple,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SET_FILES } from '../redux/filesReducer';

const getFieldValue = (root, name) => {
  const el = root.querySelector(`[name="${name}"]`);
  if (!el) return '';

  // VA web components expose `.value`
  return el.value ?? el.getAttribute('value') ?? '';
};

// Get data from the shadow DOM of the web component inputs
const extractDocumentTypesFromShadowDOM = fileInputRef => {
  if (!fileInputRef.current) return [];

  const fileInputs = Array.from(
    fileInputRef.current?.shadowRoot?.querySelectorAll('va-file-input') || [],
  );

  return fileInputs.filter(fi => fi.classList.contains('has-file')).map(fi => {
    return {
      expenseType: getFieldValue(fi, 'expense-type'),
      vendorType: getFieldValue(fi, 'vendor'),
      date: getFieldValue(fi, 'date'),
      amount: getFieldValue(fi, 'amount'),
    };
  });
};

const MultipleDocumentUpload = () => {
  const [uploadError, setUploadError] = useState('');
  // Save the slot content here as an array of objects
  const [slotContent, setSlotContent] = useState(null);
  const [rawFileState, setRawFileState] = useState([]);
  const [files, setFiles] = useState([]);

  const dispatch = useDispatch();
  // Reference to the file input web component
  const fileInputRef = useRef(null);

  const acceptedFileTypes = [
    'pdf',
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'tif',
    'tiff',
    'doc',
    'docx',
  ];

  // Combine fileState (from event.detail) with slotContent (from shadow DOM)
  const buildFilesWithSlotContent = (fileState, slotMeta = []) => {
    return fileState.map((item, idx) => {
      const f = item.file;
      return {
        // safe copy
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,

        // slot content
        ...slotMeta[idx],
      };
    });
  };

  const validateFile = async file => {
    const isValidType = acceptedFileTypes.some(type =>
      file.name.toLowerCase().endsWith(`.${type.toLowerCase()}`),
    );

    if (!isValidType) {
      const allowedTypes = acceptedFileTypes.map(type => `.${type}`).join(', ');
      return `Invalid file type. Allowed types: ${allowedTypes}`;
    }

    const maxSize = 5_000_000; // 5 MB
    if (file.size > maxSize) {
      return `File too large. Max size is ${Math.round(
        maxSize / 1024 / 1024,
      )}MB.`;
    }

    return null;
  };

  const handleChange = async event => {
    setUploadError(''); // Clear any previous errors

    const { action, file, state: fileState = [] } = event.detail || {};

    setRawFileState(fileState);

    const newFiles = buildFilesWithSlotContent(fileState, slotContent || []);
    setFiles(newFiles);
    dispatch({ type: SET_FILES, payload: newFiles });

    // Validate file for FILE_ADDED and FILE_UPDATED
    if (action === 'FILE_ADDED' || action === 'FILE_UPDATED') {
      const error = await validateFile(file);
      if (error) {
        setUploadError(error);
      }
    }
  };

  const additionalFormInputsContent = (
    <>
      <VaDate label="Date" name="date" required />
      <VaTextInput
        currency
        label="Expense Amount"
        name="amount"
        required
        show-input-error
      />
      <VaTextInput label="Vendor Name" name="vendor" required />
      <VaSelect label="Expense Type" name="expense-type" required>
        <option value="gas-mileage">Gas mileage</option>
        <option value="parking-fees">Parking Fees</option>
        <option value="tolls">Tolls</option>
        <option value="public-transportation">Public Transportation</option>
        <option value="taxi">Taxi/Rideshare</option>
        <option value="lodging">Lodging</option>
        <option value="meals">Meals</option>
        <option value="other">Other Travel Expenses</option>
      </VaSelect>
    </>
  );

  useEffect(
    () => {
      const inputRoot = fileInputRef.current?.shadowRoot;
      if (!inputRoot) return;

      const observer = new MutationObserver(() => {
        const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);
        setSlotContent(currentDocTypes);
        // rebuild merged files when slot content changes

        const newFiles = buildFilesWithSlotContent(
          rawFileState,
          currentDocTypes,
        );
        setFiles(newFiles);
        dispatch({ type: SET_FILES, payload: newFiles });
      });

      observer.observe(inputRoot, {
        subtree: true,
        childList: true,
        attributes: true,
      });

      // eslint-disable-next-line consistent-return
      return () => observer.disconnect();
    },
    [rawFileState, dispatch],
  );

  return (
    <>
      {uploadError && (
        <VaAlert status="error" class="vads-u-margin-top--2">
          <h2 slot="headline">File upload error</h2>
          <p>{uploadError}</p>
        </VaAlert>
      )}

      <VaFileInputMultiple
        accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
        hint={`Accepted file types: ${acceptedFileTypes
          .map(type => type.toUpperCase())
          .join(', ')}`}
        label="Upload a document for your expense"
        maxFileSize={5000000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaMultipleChange={handleChange}
        ref={fileInputRef}
      >
        {additionalFormInputsContent}
      </VaFileInputMultiple>
    </>
  );
};

export default MultipleDocumentUpload;
