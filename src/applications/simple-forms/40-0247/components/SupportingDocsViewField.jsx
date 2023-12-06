import React from 'react';

import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { supportingDocsDescription } from '../helpers';

const SupportingDocsViewField = props => {
  const { defaultEditButton, formData } = props;
  const { veteranSupportingDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h4 className="vads-u-margin-y--0">
          Upload documents (preferably DD214)
        </h4>
        {defaultEditButton()}
      </div>
      <div>{supportingDocsDescription}</div>
      {veteranSupportingDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {veteranSupportingDocuments.map((doc, index) => (
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

SupportingDocsViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    veteranSupportingDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default SupportingDocsViewField;
