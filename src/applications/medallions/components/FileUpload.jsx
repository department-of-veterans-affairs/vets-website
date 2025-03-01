import React, { useState } from 'react';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import FileList from './FileList';

// Helper: convert bytes to MB
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

const setLocalFiles = files => {
  localStorage.setItem('medallionsFiles', JSON.stringify(files));
};

const FileUpload = props => {
  const dispatch = useDispatch();
  const {
    acceptFileTypes = '.pdf,.jpeg,.png,.jpg',
    label = 'Select optional files to upload',
    hint = 'You can upload a .jpg, .pdf, or .png file. A .jpg or .png file must be less than 50MB. A .pdf file must be less than 100MB.',
    formData,
    editMode,
    path,
  } = props;

  const firstInputID = 'medallions_upload_first';
  const errorMessage = 'File must be less than 25 MB';

  // Unified state for all files (both existing and newly added)
  const [files, setFiles] = useState(formData.supportingDocuments || []);
  const [fileErrors, setFileErrors] = useState([]);

  // Update Redux formData with new file attachments
  const updateFormData = updatedFiles => {
    const updatedFormData = set('supportingDocuments', updatedFiles, formData);
    dispatch(setData(updatedFormData));
  };

  const clearError = fileID => {
    setFileErrors(prevErrors => prevErrors.filter(id => id !== fileID));
  };

  // Delete file by its index in the unified files array
  const onDeleteFile = index => {
    const fileToDelete = files[index];
    if (fileToDelete) {
      const updatedFiles = files.filter((file, idx) => idx !== index);
      setFiles(updatedFiles);
      updateFormData(updatedFiles);
    }
  };

  const onReplaceFile = (fileIndex, event) => {
    const { files: fileList } = event.detail;
    if (fileList && fileList[0]) {
      const newFile = fileList[0];

      // Validate file size (< 25 MB)
      if (getFileSizeMB(newFile.size) > 25) {
        setFileErrors(prevErrors =>
          Array.from(new Set([...prevErrors, fileIndex])),
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Img = reader.result;
        const replacedFile = {
          fileName: newFile.name,
          fileSize: newFile.size,
          fileType: newFile.type,
          base64: base64Img,
          // Preserve the fileID so any key-based logic stays intact
          fileID: files[fileIndex].fileID,
        };

        const updatedFiles = files.map(
          (file, idx) => (idx === fileIndex ? replacedFile : file),
        );
        setLocalFiles(updatedFiles);
        setFiles(updatedFiles);
        updateFormData(updatedFiles);
      };
      reader.readAsDataURL(newFile);
    }
  };

  // Remove file using its fileID (used when a file input is cleared)
  const onRemoveFile = fileID => {
    if (fileErrors.includes(fileID)) {
      clearError(fileID);
    } else {
      const updatedFiles = files.filter(file => file.fileID !== fileID);
      setFiles(updatedFiles);
      updateFormData(updatedFiles);
    }
  };

  // Add a new file from the file input
  const onAddFile = event => {
    const { files: fileList } = event.detail;
    const inputID = event.srcElement['data-testid'];

    if (fileList?.[0] && getFileSizeMB(fileList[0].size) > 25) {
      setFileErrors(prevErrors =>
        Array.from(new Set([...prevErrors, inputID])),
      );
      return;
    }

    if (fileErrors.includes(inputID)) clearError(inputID);

    if (fileList?.length) {
      const currentFile = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Img = reader.result;
        const newFileData = {
          fileName: currentFile.name,
          fileSize: currentFile.size,
          fileType: currentFile.type,
          base64: base64Img,
          fileID: _.uniqueId(inputID),
        };
        const updatedFiles = [...files, newFileData];
        setFiles(updatedFiles);
        updateFormData(updatedFiles);
      };
      reader.readAsDataURL(currentFile);
    } else {
      onRemoveFile(inputID);
    }
  };

  return (
    <div>
      <div className="usa-form-group">
        {files.length > 0 && (
          <FileList
            files={files}
            onReplace={onReplaceFile}
            onDelete={onDeleteFile}
            editMode={editMode}
            path={path}
          />
        )}
        {(editMode || path !== '/review-and-submit') && (
          <>
            <VaFileInputMultiple
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
