import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { MEDAL_AWARD_DESCRIPTION } from '../config/constants';

const MedalAwardViewField = props => {
  const { defaultEditButton, formData } = props;
  const { medalAwardDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for Medal of Honor or Purple Heart award recipient
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="medalAwardDescription">{MEDAL_AWARD_DESCRIPTION}</div>
      {medalAwardDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {medalAwardDocuments.map((doc, index) => (
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

MedalAwardViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    medalAwardDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default MedalAwardViewField;
