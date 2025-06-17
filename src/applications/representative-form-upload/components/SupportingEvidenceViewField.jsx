import React from 'react';
// import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';
import { getFormNumber } from '../helpers';

const SupportingEvidenceViewField = props => {
  const { defaultEditButton, formData } = props;
  const { supportingDocuments, uploadedFile } = formData;

  // debugger
  // need to fix hitting that edit button
  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">Uploaded files</h3>
        {defaultEditButton()}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <h4>VA Form {getFormNumber()}</h4>
        <span className="va-growable-background">
          {uploadedFile.name} ({displayFileSize(uploadedFile.size)})
        </span>
      </div>
      {supportingDocuments && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <h4>Supporting Evidence</h4>
          <ul className="schemaform-file-list vads-u-width--full">
            {supportingDocuments.map((doc, index) => (
              <li key={index} className="va-growable-background">
                <strong>{doc.name}</strong>
                <br />
                {displayFileSize(doc.size)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

SupportingEvidenceViewField.propTypes = {
  // defaultEditButton: PropTypes.func.isRequired,
  // formData: PropTypes.shape({
  //   supportingDocuments: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       fileName: PropTypes.string,
  //       fileSize: PropTypes.number,
  //       confirmationNumber: PropTypes.string,
  //       errorMessage: PropTypes.string,
  //     }),
  //   ),
  // }).isRequired,
};

export default SupportingEvidenceViewField;
