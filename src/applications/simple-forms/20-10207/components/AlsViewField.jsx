import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { ALS_DESCRIPTION } from '../config/constants';

const AlsViewField = props => {
  const { defaultEditButton, formData } = props;
  const { alsDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for diagnosis of ALS (amyotrophic lateral sclerosis)
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="alsDescription">{ALS_DESCRIPTION}</div>
      {alsDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {alsDocuments.map((doc, index) => (
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

AlsViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    alsDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default AlsViewField;
