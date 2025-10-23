import React from 'react';
import PropTypes from 'prop-types';

import { getFormNumber } from '../helpers';

const SupportingEvidenceViewField = props => {
  const { formData, defaultEditButton } = props;
  const { supportingDocuments, uploadedFile } = formData;

  return (
    <div className="form-review-panel-page form-review-panel-page-representative-form-upload">
      <div className="form-review-panel-page-header-row vads-u-justify-content--space-between">
        <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--1">
          Upload VA Form {getFormNumber()}
        </h4>
        {defaultEditButton()}
        <dl className="review vads-u-margin-top--2 vads-u-width--full">
          {uploadedFile && (
            <div className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--1 vads-u-width--full">
              <dt className="vads-u-font-weight--normal">
                VA Form {getFormNumber()}
              </dt>
              <dd className="vads-u-font-weight--bold">{uploadedFile.name}</dd>
            </div>
          )}
        </dl>
      </div>

      {supportingDocuments?.length > 0 && (
        <div className="form-review-panel-page-header-row vads-u-justify-content--space-between">
          <h4 className="vads-u-font-size--h5 vads-u-margin-top--3 vads-u-margin-bottom--1">
            Upload supporting evidence
          </h4>
          <div className="vads-u-margin-top--3">{defaultEditButton()}</div>
          <dl className="review vads-u-margin-top--2 vads-u-width--full">
            {supportingDocuments.map(doc => (
              <div
                key={doc.name}
                className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-y--1 vads-u-width--full"
              >
                <dt className="vads-u-font-weight--normal">
                  Supporting evidence
                </dt>
                <dd className="vads-u-font-weight--bold">{doc.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

SupportingEvidenceViewField.propTypes = {
  formData: PropTypes.shape({
    supportingDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        size: PropTypes.number,
      }),
    ),
    uploadedFile: PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
    }),
  }).isRequired,
};

export default SupportingEvidenceViewField;
