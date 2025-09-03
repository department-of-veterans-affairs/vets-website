import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  VaProgressBar,
  VaDate,
  VaAlert,
  VaFileInputMultiple,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  ADD_FILE,
  REMOVE_FILE,
  UPDATE_EXPENSE_TYPE,
  UPDATE_DATE,
  UPDATE_AMOUNT,
  UPDATE_VENDOR_TYPE,
} from '../redux/filesReducer';

//Get data from the shadow DOM of the web component inputs
const extractDocumentTypesFromShadowDOM = fileInputRef => {
  const fileInputs = Array.from(
    fileInputRef.current?.shadowRoot?.querySelectorAll('va-file-input') || [],
  );

  return fileInputs.map(fileInput => {
    const vaSelect = fileInput.querySelector('va-select');
    const vaTextInput = fileInput.querySelector('va-text-input');
    return {
      select: vaSelect?.value || '',
      textInput: vaTextInput?.value || '',
    };
  });
};

const MultipleDocumentUpload = () => {
  const [uploadError, setUploadError] = useState('');
  //Save the slot content here as an array of objects
  const [slotContent, setSlotContent] = useState(null);

  const dispatch = useDispatch();
  //Reference to the file input web component
  const fileInputRef = useRef(null);
  const files = useSelector(state => state.files.files);

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

  // Commented out the addFile function to get around the re-rendering issue

  // const addFile = (file, currentIndex) => {
  //   dispatch({
  //     type: ADD_FILE,
  //     index: currentIndex, // the slot you want to update
  //     payload: {
  //       file, // optional, store the actual File object if needed
  //       name: file.name,
  //       date: '',
  //       amount: null,
  //       vendorType: '',
  //       expenseType: '',
  //     },
  //   });
  // };

  const removeFile = index => {
    dispatch({ type: REMOVE_FILE, index });
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
    let componentFiles = [];
    let propFiles = [];
    let currentIndex;
    const { action, file, state: fileState = [] } = event.detail || {};

    // Set componentFiles, propFiles and currentIndex
    if (fileState.length > 0) {
      componentFiles = fileState.map((x, index) => {
        return { index, name: x.file.name };
      });

      propFiles = files.map((x, index) => {
        return { index, name: x.file.name };
      });
      currentIndex = fileState.findIndex(f => f.file.name === file.name);
    }

    // Add File
    if (action === 'FILE_ADDED') {
      const error = await validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      // addFile(file, currentIndex);
    }
    // Remove File, no other files
    if (action === 'FILE_REMOVED' && fileState.length === 0) {
      removeFile(0);
    }
    // Changed File
    if (action === 'FILE_UPDATED' || action === 'FILE_REMOVED') {
      // Remove File and Update
      const fileToDelete = propFiles.filter(propFile => {
        return componentFiles.some(
          componentFile => propFile.name !== componentFile.name,
        );
      });
      removeFile(fileToDelete[0].index);

      if (action === 'FILE_UPDATED') {
        // Add New File
        const error = await validateFile(event.file);
        if (error) {
          setUploadError(error);
          return;
        }
        // addFile(file, currentIndex);
      }
    }
  };

  const handleExpenseTypeChange = (expenseType, index) => {
    dispatch({ type: UPDATE_EXPENSE_TYPE, index, payload: expenseType });
  };

  const handleDateChange = (date, index) => {
    dispatch({ type: UPDATE_DATE, index, payload: date });
  };

  const handleAmountChange = (newAmount, index) => {
    dispatch({ type: UPDATE_AMOUNT, index, payload: newAmount });
  };

  const handleVendorChange = (vendorType, index) => {
    dispatch({ type: UPDATE_VENDOR_TYPE, index, payload: vendorType });
  };

  //Add a submit button to get the current values from the shadow DOM
  const handleSubmit = e => {
    e.preventDefault();
    const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);
    setSlotContent(currentDocTypes);
  }

  const additionalFormInputsContent = (
    <>
      {files.map((fileObject, index) => (
        <div key={index} className="document-item-container">
          <VaDate
            label="Date"
            name="expense-date"
            value={fileObject.date || ''}
            onVaDateChange={val => handleDateChange(val, index)}
            required
          />
          <VaTextInput
            currency
            label="Expense Amount"
            name="expense-amount"
            value={fileObject.amount || ''}
            onVaInputChange={e => {
              handleAmountChange(e.target.value, index);
            }}
            required
            show-input-error
          />
          <VaTextInput
            id="expense-vendor"
            label="Vendor Name"
            name="expense-vendor"
            value={fileObject.vendorType || ''}
            required
            onVaInput={e => handleVendorChange(e.target.value, index)}
          />
          <VaSelect
            label="Expense Type"
            name="expense-type"
            required
            value={fileObject.expenseType || ''}
            onVaSelect={e => handleExpenseTypeChange(e.detail.value, index)}
          >
            <option value="gas-mileage">Gas mileage</option>
            <option value="parking-fees">Parking Fees</option>
            <option value="tolls">Tolls</option>
            <option value="public-transportation">Public Transportation</option>
            <option value="taxi">Taxi/Rideshare</option>
            <option value="lodging">Lodging</option>
            <option value="meals">Meals</option>
            <option value="other">Other Travel Expenses</option>
          </VaSelect>
        </div>
      ))}
    </>
  );

  // Attempted a use effect here to see if it would re render the slot int he component
  // but this is also not working so the input fields are not updating
  // useEffect(
  //   () => {
  //     const newSlotContent = files.map((fileObj, index) => (
  //       <div key={index} className="document-item-container">
  //         <VaDate
  //           label="Date"
  //           value={fileObj.date || ''}
  //           onVaDateChange={val => handleDateChange(val, index)}
  //           required
  //         />
  //         <VaTextInput
  //           currency
  //           label="Expense Amount"
  //           value={fileObj.amount || ''}
  //           onVaInputChange={e => handleAmountChange(e.target.value, index)}
  //           required
  //         />
  //         <VaTextInput
  //           label="Vendor Name"
  //           value={fileObj.vendorType || ''}
  //           onVaInput={e => handleVendorChange(e.target.value, index)}
  //           required
  //         />
  //         <VaSelect
  //           label="Expense Type"
  //           value={fileObj.expenseType || ''}
  //           onVaSelect={e => handleExpenseTypeChange(e.detail.value, index)}
  //           required
  //         >
  //           <option value="gas-mileage">Gas mileage</option>
  //           <option value="parking-fees">Parking Fees</option>
  //           <option value="tolls">Tolls</option>
  //           <option value="public-transportation">Public Transportation</option>
  //           <option value="taxi">Taxi/Rideshare</option>
  //           <option value="lodging">Lodging</option>
  //           <option value="meals">Meals</option>
  //           <option value="other">Other Travel Expenses</option>
  //         </VaSelect>
  //       </div>
  //     ));

  //     setSlotContent(newSlotContent);
  //   },
  //   [files],
  // );

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
        {/* Slot content for additional inputs per file */}
         <VaSelect
            label="Expense Type"
            name="expense-type"
            required
            onVaSelect={e => handleExpenseTypeChange(e.detail.value, index)}
            >
            <option value="gas-mileage">Gas mileage</option>
            <option value="parking-fees">Parking Fees</option>
            <option value="tolls">Tolls</option>
            <option value="public-transportation">Public Transportation</option>
            <option value="taxi">Taxi/Rideshare</option>
            <option value="lodging">Lodging</option>
            <option value="meals">Meals</option>
            <option value="other">Other Travel Expenses</option>
          </VaSelect>
          <VaTextInput
            currency
            label="Expense Amount"
            name="expense-amount"
            show-input-error
          />
        {/* {additionalFormInputsContent} */}
      </VaFileInputMultiple>
      <button type="button" onClick={handleSubmit}>Submit</button>
      {console.log(slotContent, 'slotContent in return')}
    </>
  );
};

export default MultipleDocumentUpload;
