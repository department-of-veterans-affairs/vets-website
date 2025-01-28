import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import _ from 'lodash';

const idList = numberOfIDs => {
  const ids = [];
  for (let i = 0; i < numberOfIDs; i++) {
    ids.push(`askVA_upload_${i}`);
  }
  return ids;
};

const FileUpload = props => {
  const {
    acceptFileTypes = '.pdf,.jpeg,.png,.jpg',
    buttonText = 'Upload file',
    error,
    label = 'Select optional files to upload',
    hint = 'You can upload a .pdf, .jpeg, or .png file that is less than 25 MB in size',
    // success = null,
  } = props;

  const first = 'askVA_upload_first';
  const uploadIDs = idList(10);
  const [attachments, setAttachments] = useState([]);

  const onRemoveFile = fileToRemoveID => {
    const uploadedFiles = localStorage.getItem('askVAFiles');
    const parseFiles = JSON.parse(uploadedFiles);
    const removedFile = parseFiles.filter(
      file => file.fileID !== fileToRemoveID,
    );
    localStorage.askVAFiles = JSON.stringify(removedFile);
    setAttachments(attachments.filter(file => file.fileID !== fileToRemoveID));
  };

  const onAddFile = async event => {
    const { files } = event.detail;

    if (files.length) {
      const currentFile = files[0];
      const reader = new FileReader();
      const storedFile = localStorage.getItem('askVAFiles');

      reader.readAsDataURL(currentFile);
      reader.onload = () => {
        const base64Img = reader.result;
        const imgData = {
          fileName: files[0].name,
          fileSize: files[0].size,
          fileType: files[0].type,
          base64: base64Img,
          fileID: _.uniqueId(`${event.target['data-testid']}`),
        };

        const questionFiles = storedFile
          ? [...JSON.parse(storedFile), imgData]
          : [imgData];
        setAttachments([...attachments, imgData]);
        localStorage.askVAFiles = JSON.stringify(questionFiles);
      };
    } else {
      onRemoveFile(event.target['data-testid']);
    }
  };

  // const renderAlert = () => {
  //   if (success === true) {
  //     return (
  //       <div className="usa-alert usa-alert--success usa-alert--slim">
  //         <div className="usa-alert__body">
  //           <p className="usa-alert__text">File attached successfully</p>
  //         </div>
  //       </div>
  //     );
  //   }
  //   if (success === false) {
  //     return (
  //       <div className="usa-alert usa-alert--error usa-alert--slim">
  //         <div className="usa-alert__body">
  //           <p className="usa-alert__text">Issue uploading your file</p>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const fileInputs = () => {
    return attachments.map((attachment, i) => {
      return (
        <VaFileInput
          key={i}
          accept={acceptFileTypes}
          data-testid={uploadIDs[i]}
          error={error}
          aria-label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
      );
    });
  };

  return (
    <div>
      <div className="usa-form-group">
        <VaFileInput
          className="vads-u-margin-y--neg1"
          accept={acceptFileTypes}
          multiple="multiple"
          button-text={buttonText}
          data-testid={first}
          error={error}
          hint={hint}
          label={label}
          name="usa-file-input"
          onVaChange={onAddFile}
          uswds
        />
        {fileInputs()}
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
};

export default FileUpload;
