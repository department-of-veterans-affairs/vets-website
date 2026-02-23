import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { MEDICATION_REFILL_CONFIG_V2 } from '../../util/constants';
import { RefillAlert } from './RefillAlert';
import { RefillMedicationList } from './RefillMedicationList';

const config = MEDICATION_REFILL_CONFIG_V2.SUCCESS;

export const SuccessNotificationV2 = ({ handleClick, successfulMeds }) => {
  return (
    <RefillAlert
      config={config}
      additionalProps={{ 'data-dd-privacy': 'mask' }}
    >
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
          to="/my-health/medications/in-progress"
          className="hide-visited-link"
          data-dd-action-name={
            dataDogActionNames.refillPage
              .GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK
          }
          onClick={handleClick}
        >
          {config.linkText}
        </Link>
      </div>
    </RefillAlert>
  );
};

SuccessNotificationV2.propTypes = {
  handleClick: PropTypes.func.isRequired,
  successfulMeds: PropTypes.array.isRequired,
};

export default SuccessNotificationV2;
