import React from 'react';
import { FILE_SIZE_MAX, FILE_TYPES_ACCEPTED } from '../../utils/constants';

const FileUploadDescription = () => {
  const typeList = new Intl.ListFormat('en', { type: 'disjunction' }).format(
    FILE_TYPES_ACCEPTED.map(ext => `.${ext}`),
  );
  return (
    <div className="vads-u-margin-bottom--4">
      <strong>What to know about uploading files</strong>
      <ul>
        <li>Use a {typeList} file</li>
        <li>Make sure that file size is {FILE_SIZE_MAX} or less</li>
        <li>
          If you only have a paper copy, scan or take a photo and upload the
          image
        </li>
      </ul>
    </div>
  );
};

export default FileUploadDescription;
