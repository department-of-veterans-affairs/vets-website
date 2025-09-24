import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const RefillAlert = props => {
  const { dataDogActionName, refillStatus, refillAlertList } = props;

  // Don't display the alert when refills are in progress or completed
  const hideAlert =
    refillStatus === 'inProgress' || refillStatus === 'finished';

  return (
    <VaAlert
      status="warning"
      visible={!!refillAlertList?.length && !hideAlert}
      uswds
      className={refillAlertList?.length ? 'vads-u-margin-bottom--3' : ''}
      data-testid="alert-banner"
      data-dd-privacy="mask"
    >
      <h2 slot="headline" data-testid="rxDelay-alert-message">
        Some refills are taking longer than expected
      </h2>
      <p>Go to your medication details to find out what to do next:</p>
      {[...(refillAlertList || [])]
        ?.sort((rxA, rxB) => {
          const nameA = rxA.prescriptionName || rxA.orderableItem || '';
          const nameB = rxB.prescriptionName || rxB.orderableItem || '';
          return nameA.localeCompare(nameB);
        })
        .map(rx => (
          <p
            className="vads-u-margin-bottom--0"
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
          </p>
        ))}
    </VaAlert>
  );
};

RefillAlert.propTypes = {
  dataDogActionName: PropTypes.string,
  refillAlertList: PropTypes.arrayOf(
    PropTypes.shape({
      prescriptionId: PropTypes.number.isRequired,
      prescriptionName: PropTypes.string.isRequired,
    }),
  ),
  refillStatus: PropTypes.string,
};

export default RefillAlert;
