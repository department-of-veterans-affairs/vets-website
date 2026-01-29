import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const DelayedRefillAlert = props => {
  const { dataDogActionName, refillAlertList } = props;

  const sortPrescriptionsByName = prescriptions => {
    return [...prescriptions].sort((rxA, rxB) => {
      const nameA = rxA.prescriptionName || rxA.orderableItem || '';
      const nameB = rxB.prescriptionName || rxB.orderableItem || '';
      return nameA.localeCompare(nameB);
    });
  };

  const sortedPrescriptions = sortPrescriptionsByName(refillAlertList);

  return (
    <VaAlert
      status="warning"
      visible
      className="vads-u-margin-bottom--3"
      data-testid="mhv-rx--delayed-refill-alert"
      data-dd-privacy="mask"
    >
      <h2 slot="headline" data-testid="rxDelay-alert-message">
        Some refills are taking longer than expected
      </h2>
      <p>Go to your medication details to find out what to do next:</p>
      <ul className="medications-list-style--none vads-u-padding-left--0">
        {sortedPrescriptions.map(rx => (
          <li
            className="vads-u-margin-bottom--2"
            key={rx.prescriptionId}
            data-dd-privacy="mask"
          >
            <Link
              id={`refill-alert-link-${rx.prescriptionId}`}
              data-dd-privacy="mask"
              data-testid={`refill-alert-link-${rx.prescriptionId}`}
              className="vads-u-font-weight--bold"
              to={`/prescription/${rx.prescriptionId}`}
              data-dd-action-name={dataDogActionName}
            >
              {rx.prescriptionName}
            </Link>
          </li>
        ))}
      </ul>
    </VaAlert>
  );
};

DelayedRefillAlert.propTypes = {
  dataDogActionName: PropTypes.string,
  refillAlertList: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      prescriptionName: PropTypes.string.isRequired,
    }),
  ),
};

export default DelayedRefillAlert;
