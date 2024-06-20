import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { additionalContext } from '../actions/day-of';
import { makeSelectCurrentContext } from '../selectors';

const TravelWarningAlert = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hideAlert = () => {
    dispatch(additionalContext({ showTravelReimbursementWarning: false }));
  };
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { showTravelReimbursementWarning } = useSelector(selectCurrentContext);

  return (
    <section className="vads-u-margin-bottom--1">
      <VaAlert
        class="vads-u-margin-bottom--1"
        closeable
        uswds
        close-btn-aria-label="Close notification"
        visible={showTravelReimbursementWarning !== false}
        onCloseEvent={hideAlert}
        disable-analytics="false"
        status="warning"
      >
        <p data-testid="travel-btsss-message" className="vads-u-margin-y--0">
          {t('you-can-still-check-in-travel-reimbursement')}
        </p>
      </VaAlert>
    </section>
  );
};

export default TravelWarningAlert;
