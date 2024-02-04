import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { POW_UPLOAD_DESCRIPTION } from '../config/constants';

const PowUpload2ViewField = props => {
  const { defaultEditButton, formData } = props;
  const { powDocuments2 } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for prisoner of war status
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="terminalIllnessDescription">
        {POW_UPLOAD_DESCRIPTION}
      </div>
      {powDocuments2 && (
        <ul className="schemaform-file-list vads-u-width--full">
          {powDocuments2.map((doc, index) => (
            <li key={index} className="va-growable-background">
              <strong>{doc.name}</strong>
              <br />
              {displayFileSize(doc.size)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

PowUpload2ViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    powDocuments2: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default PowUpload2ViewField;
