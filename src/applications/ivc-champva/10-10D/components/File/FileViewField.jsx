import React from 'react';
import PropTypes from 'prop-types';
import { getFileSize } from '../../helpers/utilities';

// Review page component for the FileUpload custompage.
export default function FileViewField(props) {
  return (
    <div>
      <h4 className="form-review-panel-page-header vads-u-font-size--h5">
        Supporting Documents
      </h4>
      {props.data.supportingDocuments?.length > 0 ? (
        <ul>
          {props.data.supportingDocuments.map(file => {
            return (
              <li key={file.name + file.size}>
                {file.name} - {getFileSize(file.size)}
              </li>
            );
          })}
        </ul>
      ) : (
        'No supporting docs to show'
      )}
    </div>
  );
}

FileViewField.propTypes = {
  data: { supportingDocuments: PropTypes.array },
};
