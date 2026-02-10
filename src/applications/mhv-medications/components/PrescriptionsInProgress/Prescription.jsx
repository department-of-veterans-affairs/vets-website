import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { dateFormat } from '../../util/helpers';

const Prescription = ({ prescriptionId, prescriptionName, lastUpdated }) => {
  // TODO update this to return different labels based on status
  const getSubtext = () => `Request submitted: ${dateFormat(lastUpdated)}`;

  return (
    <div>
      <Link
        className="vads-u-font-weight--bold"
        to={`/my-health/medications/${prescriptionId}`}
        data-testid="prescription-link"
      >
        {prescriptionName}
      </Link>
      <p className="vads-u-margin-top--0">{getSubtext()}</p>
    </div>
  );
};

Prescription.propTypes = {
  lastUpdated: PropTypes.string.isRequired,
  prescriptionId: PropTypes.number.isRequired,
  prescriptionName: PropTypes.string.isRequired,
};

export default Prescription;
