import React from 'react';
import PropTypes from 'prop-types';

import AdditionalEvidencePageOld from '../containers/AdditionalEvidencePageOld';
import FilesOptionalOld from './FilesOptionalOld';
import FilesNeededOld from './FilesNeededOld';

export default function RequestedFilesInfo({ id, filesNeeded, optionalFiles }) {
  const documentsNeeded = filesNeeded.length + optionalFiles.length === 0;

  return (
    <div className="claims-requested-files-container">
      <div className="file-request-list">
        <h2 className="claim-file-border">File requests</h2>

        {documentsNeeded && (
          <p>You don’t need to turn in any documents to VA.</p>
        )}

        {filesNeeded.map(item => (
          <FilesNeededOld key={item.id} id={id} item={item} />
        ))}

        {optionalFiles.map(item => (
          <FilesOptionalOld key={item.id} id={id} item={item} />
        ))}
      </div>

      <div className="submit-file-container">
        <div className="submit-additional-evidence">
          <h2 className="claim-file-border">Additional evidence</h2>
          <AdditionalEvidencePageOld />
        </div>
      </div>
    </div>
  );
}

RequestedFilesInfo.propTypes = {
  filesNeeded: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  optionalFiles: PropTypes.array.isRequired,
};
