import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { RefillAlert } from './RefillAlert';
import { RefillMedicationList } from './RefillMedicationList';

export const SuccessNotification = ({
  config,
  handleClick,
  successfulMeds,
}) => (
  <RefillAlert config={config} additionalProps={{ 'data-dd-privacy': 'mask' }}>
    <RefillMedicationList
      medications={successfulMeds}
      testId="successful-medication-list"
    />
    <div
      className="vads-u-margin-y--0"
      data-testid="success-refill-description"
    >
      <p>{config.description}</p>
      <Link
        data-testid="back-to-medications-page-link"
        to="/"
        className="hide-visited-link"
        data-dd-action-name={
          dataDogActionNames.refillPage.GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK
        }
        onClick={handleClick}
      >
        {config.linkText}
      </Link>
    </div>
  </RefillAlert>
);

SuccessNotification.propTypes = {
  config: PropTypes.shape({
    className: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  successfulMeds: PropTypes.array.isRequired,
};

export default SuccessNotification;
