import React from 'react';
import PropTypes from 'prop-types';

import { displayFileSize } from 'platform/utilities/ui/index';

import { TERMINAL_ILLNESS_DESCRIPTION } from '../config/constants';

const TerminalIllnessViewField = props => {
  const { defaultEditButton, formData } = props;
  const { terminalIllnessDocuments } = formData;

  return (
    <div className="form-review-panel-page-header-row">
      <div className="vads-u-width--full vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h3 className="vads-u-margin-y--0">
          Upload evidence for terminal illness
        </h3>
        {defaultEditButton()}
      </div>
      <div data-testid="terminalIllnessDescription">
        {TERMINAL_ILLNESS_DESCRIPTION}
      </div>
      {terminalIllnessDocuments && (
        <ul className="schemaform-file-list vads-u-width--full">
          {terminalIllnessDocuments.map((doc, index) => (
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

TerminalIllnessViewField.propTypes = {
  defaultEditButton: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    terminalIllnessDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default TerminalIllnessViewField;
