import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { VSI_DESCRIPTION } from '../config/constants';

const VsiViewField = props => {
  const { defaultEditButton, formData } = props;
  const { vsiDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for Seriously or Very Seriously Injured or Ill during
          military operations
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="vsiDescription">{VSI_DESCRIPTION}</div>
      {vsiDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {vsiDocuments.map((doc, index) => (
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

VsiViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    vsiDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default VsiViewField;
