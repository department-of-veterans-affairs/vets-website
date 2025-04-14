import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { getRefillAlertList } from '../../actions/prescriptions';

const RefillAlert = props => {
  const { dataDogActionName } = props;
  const dispatch = useDispatch();

  const refillAlertList = useSelector(
    state => state.rx.prescriptions?.refillAlertList,
  );

  const refillNotification = useSelector(
    state => state.rx.prescriptions?.refillNotification,
  );

  useEffect(() => {
    if (!refillAlertList) {
      dispatch(getRefillAlertList());
    }
  }, []);

  return (
    <VaAlert
      status="warning"
      visible={!!refillAlertList?.length && !refillNotification}
      uswds
      className={refillAlertList?.length ? 'vads-u-margin-bottom--3' : ''}
      data-testid="alert-banner"
    >
      <h2 slot="headline" data-testid="rxDelay-alert-message">
        Some refills are taking longer than expected
      </h2>
      <p>Go to your medication details to find out what to do next:</p>
      {refillAlertList?.map(rx => {
        return (
          <p className="vads-u-margin-bottom--0" key={rx.prescriptionId}>
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
        );
      })}
    </VaAlert>
  );
};

RefillAlert.propTypes = {
  dataDogActionName: PropTypes.string,
};

export default RefillAlert;
