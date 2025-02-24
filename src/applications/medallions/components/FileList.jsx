import React from 'react';
import PropTypes from 'prop-types';
import FileListItem from './FileListItem';

const FileList = ({ files, onReplace, onDelete, editMode, path }) => (
  <>
    {files.map((file, index) => (
      <FileListItem
        key={index}
        file={file}
        index={index}
        onReplace={onReplace}
        onDelete={onDelete}
        editMode={editMode}
        path={path}
      />
    ))}
  </>
);

FileList.propTypes = {
  files: PropTypes.array,
  onReplace: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FileList;
