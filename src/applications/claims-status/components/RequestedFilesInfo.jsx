import PropTypes from 'prop-types';
import React from 'react';

import AdditionalEvidencePageOld from '../containers/AdditionalEvidencePageOld';
import { getTrackedItemId } from '../utils/helpers';
import FilesOptionalOld from './FilesOptionalOld';
import FilesNeededOld from './FilesNeededOld';

export default function RequestedFilesInfo({ id, filesNeeded, optionalFiles }) {
  return (
    <div className="claims-requested-files-container">
      <div className="file-request-list">
        <h2 className="claim-file-border">File requests</h2>

        {filesNeeded.length + optionalFiles.length === 0 ? (
          <div className="no-documents">
            <p>You don’t need to turn in any documents to VA.</p>
          </div>
        ) : null}

        {filesNeeded.map(item => (
          <FilesNeededOld key={getTrackedItemId(item)} id={id} item={item} />
        ))}

        {optionalFiles.map(item => (
          <FilesOptionalOld key={getTrackedItemId(item)} id={id} item={item} />
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
