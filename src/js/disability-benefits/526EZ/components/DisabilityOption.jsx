import React from 'react';
import PropTypes from 'prop-types';

import { getDiagnosticCodeName, getDiagnosticText } from '../reference-helpers';

export default function DisabilityOption() {
  const { diagnosticCode, diagnosticText } = this.props;

  // TODO: Figure out where the rating comes from
  return (
    <div>
      <h4>{getDiagnosticCodeName(diagnosticCode)}</h4>
      <p>{getDiagnosticText(diagnosticText)}</p>
      <br/>
      <p>Current rating: <strong>%</strong></p>
    </div>
  );
}

DisabilityOption.propTypes = {
  disability: PropTypes.shape({
    diagnosticCode: PropTypes.string().isRequired,
    diagnosticText: PropTypes.string().isRequired
  }).isRequired
};
