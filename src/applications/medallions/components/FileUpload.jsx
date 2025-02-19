import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import FileList from './FileList';

// Helper function: Convert bytes to MB (correct conversion factor)
const getFileSizeMB = size => size / 1048576;

// Download link component with file size text
const DownloadLink = ({ fileUrl, fileName, fileSize }) => {
  const fileSizeText = fileSize
    ? ` (${getFileSizeMB(fileSize).toFixed(2)} MB)`
    : '';
  return (
    <a href={fileUrl} download={fileName}>
      {`${fileName}${fileSizeText}`}
    </a>
  );
};

DownloadLink.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number,
};

// Generate an array of IDs
const idList = numberOfIDs =>
  Array.from({ length: numberOfIDs }, i => `medallions_upload_${i}`);

// Helpers to get/set files in localStorage
const getLocalFiles = () => {
  const stored = localStorage.getItem('medallionsFiles');
  return stored ? JSON.parse(stored) : [];
};

const setLocalFiles = files => {
  localStorage.setItem('medallionsFiles', JSON.stringify(files));
};

const FileUpload = props => {
  const dispatch = useDispatch();
  const {
    acceptFileTypes = '.pdf,.jpeg,.png,.jpg',
    label = 'Select optional files to upload',
    hint = 'You can upload a .pdf, .jpeg, or .png file that is less than 25 MB in size',
    formData,
    editMode,
    path,
  } = props;

  const firstInputID = 'medallions_upload_first';
  const errorMessage = 'File must be less than 25 MB';
  const uploadIDs = idList(10);

  const [attachments, setAttachments] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  // Update Redux formData with new file attachments
  const updateFormData = files => {
    const updatedFormData = set('supportingDocuments', files, formData);
    dispatch(setData(updatedFormData));
  };

  const clearError = fileID => {
    setFileErrors(prevErrors => prevErrors.filter(id => id !== fileID));
  };

  const deleteExistingFile = fileID => {
    const updatedFiles = getLocalFiles().filter(file => file.fileID !== fileID);
    setLocalFiles(updatedFiles);
    const newExistingFiles = existingFiles.filter(
      file => file.fileID !== fileID,
    );
    setExistingFiles(newExistingFiles);
    updateFormData(newExistingFiles);
  };

  const onDeleteExistingFile = index => {
    const fileToDelete = existingFiles[index];
    if (fileToDelete) {
      deleteExistingFile(fileToDelete.fileID);
    }
  };

  const onRemoveFile = fileID => {
    if (fileErrors.includes(fileID)) {
      clearError(fileID);
    } else {
      const updatedFiles = getLocalFiles().filter(
        file => file.fileID !== fileID,
      );
      setLocalFiles(updatedFiles);
      const newAttachments = attachments.filter(file => file.fileID !== fileID);
      setAttachments(newAttachments);
      updateFormData(newAttachments);
    }
  };

  const onAddFile = event => {
    const { files } = event.detail;
    const inputID = event.srcElement['data-testid'];

    if (files?.[0] && getFileSizeMB(files[0].size) > 25) {
      setFileErrors(prevErrors =>
        Array.from(new Set([...prevErrors, inputID])),
      );
      return;
    }

    if (fileErrors.includes(inputID)) clearError(inputID);

    if (files?.length) {
      const currentFile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(currentFile);
      reader.onload = () => {
        const base64Img = reader.result;
        const imgData = {
          fileName: currentFile.name,
          fileSize: currentFile.size,
          fileType: currentFile.type,
          base64: base64Img,
          fileID: _.uniqueId(inputID),
        };

        // Update localStorage
        const updatedFiles = [...getLocalFiles(), imgData];
        setLocalFiles(updatedFiles);

        // Update attachments state and Redux formData
        const newAttachments = [...attachments, imgData];
        setAttachments(newAttachments);
        updateFormData(newAttachments);
      };
    } else {
      onRemoveFile(inputID);
    }
  };

  // Load files from localStorage on component mount
  const loadExistingFiles = () => {
    const storedFiles = getLocalFiles();
    if (storedFiles?.length) {
      setExistingFiles(storedFiles);
    }
  };

  useEffect(() => {
    if (existingFiles.length === 0) {
      loadExistingFiles();
    }
  }, []); // Run once on mount

  const renderDynamicFileInputs = () =>
    attachments.map((attachment, i) => (
      <VaFileInput
        key={i}
        accept={acceptFileTypes}
        data-testid={uploadIDs[i]}
        error={fileErrors.includes(uploadIDs[i]) ? errorMessage : ''}
        aria-label={label}
        name="usa-file-input"
        onVaChange={onAddFile}
        uswds
      />
    ));

  return (
    <div>
      <div className="usa-form-group">
        {existingFiles.length > 0 && (
          // <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
          //   <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
          //     {existingFiles.map(file => (
          //       <div
          //         key={`${file.fileID}-${file.fileName}-edit`}
          //         className="review-page-attachments"
          //       >
          //         <dt className="form-review-panel-page-header vads-u-margin-bottom--2 vads-u-color--link-default">
          //           <va-icon icon="attach_file" size={3} />
          //           <DownloadLink
          //             fileUrl={file.base64}
          //             fileName={file.fileName}
          //             fileSize={file.fileSize}
          //           />
          //         </dt>
          //         <dd className="vads-u-margin-right--0">
          //           <va-button-icon
          //             button-type="delete"
          //             onClick={() => deleteExistingFile(file.fileID)}
          //           />
          //         </dd>
          //       </div>
          //     ))}
          //   </dl>
          // </div>
          <FileList
            files={existingFiles}
            onClick={e => onDeleteExistingFile(e)}
            editMode={editMode}
            path={path}
          />
        )}
        {(editMode || path !== '/review-and-submit') && (
          <>
            <VaFileInput
              className="vads-u-margin-y--neg1"
              accept={acceptFileTypes}
              multiple="multiple"
              data-testid={firstInputID}
              error={fileErrors.includes(firstInputID) ? errorMessage : ''}
              hint={hint}
              label={label}
              name="usa-file-input"
              onVaChange={onAddFile}
              uswds
            />
            {renderDynamicFileInputs()}
          </>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  acceptFileTypes: PropTypes.string,
  buttonText: PropTypes.string,
  enableAnalytics: PropTypes.bool,
  error: PropTypes.string,
  header: PropTypes.string,
  hint: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  showDescription: PropTypes.bool,
  success: PropTypes.bool,
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
  editMode: state?.form?.pages?.supportingDocumentsUpload?.editMode,
  path: state?.navigation?.route?.path,
});

export default connect(mapStateToProps)(FileUpload);
