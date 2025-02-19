import React from 'react';
import PropTypes from 'prop-types';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const FileListItem = ({ index, file, onReplace, onDelete, editMode, path }) => {
  const onChange = event => {
    const { files } = event.detail;
    if (files.length > 0) {
      onReplace(index, event);
    } else {
      onDelete(index);
    }
  };

  const showButton = editMode || path !== '/review-and-submit';
  return (
    <VaFileInput
      maxFileSize={Infinity}
      name="my-file-input"
      readOnly={!showButton}
      status-text={null}
      uploadedFile={{
        name: file.fileName,
        size: file.fileSize,
      }}
      uswds
      onVaChange={onChange}
      value={file}
    />
  );
};

FileListItem.propTypes = {
  index: PropTypes.number.isRequired,
  file: PropTypes.object,
  onReplace: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  path: PropTypes.string,
};

export default FileListItem;
