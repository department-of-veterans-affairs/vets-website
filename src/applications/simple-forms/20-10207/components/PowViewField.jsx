import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { POW_DESCRIPTION } from '../config/constants';

const PowViewField = props => {
  const { defaultEditButton, formData } = props;
  const { powDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for prisoner of war status
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="powDescription">{POW_DESCRIPTION}</div>
      {powDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {powDocuments.map((doc, index) => (
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

PowViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    powDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default PowViewField;
