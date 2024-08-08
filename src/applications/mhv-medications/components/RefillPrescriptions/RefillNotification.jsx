import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { dataDogActionNames } from '../../util/dataDogConstants';

const RefillNotification = ({ refillResult = {} }) => {
  useEffect(
    () => {
      if (refillResult?.status === 'finished') {
        let elemId = '';
        if (refillResult?.successfulMeds.length === 0) {
          elemId = 'failed-refill';
        } else if (refillResult?.failedMeds.length > 0) {
          elemId = 'partial-refill';
        } else {
          elemId = 'success-refill';
        }
        const element = document.getElementById(elemId);
        if (element) {
          focusElement(element);
        }
      }
    },
    [refillResult],
  );
  const isNotSubmitted =
    refillResult?.status === 'finished' &&
    refillResult?.successfulMeds.length === 0 &&
    refillResult?.failedMeds.length === 0;
  const isPartiallySubmitted = refillResult?.failedMeds.length > 0;
  const isSuccess = refillResult?.successfulMeds.length > 0;
  return (
    <>
      <va-alert
        visible={isNotSubmitted}
        id="failed-refill"
        status="error"
        setFocus
        uswds
        class={isNotSubmitted ? 'vads-u-margin-y--1' : ''}
      >
        <h2
          className="vads-u-margin-y--0 vads-u-font-size--h3"
          data-testid="failed-message-title"
        >
          Request not submitted
        </h2>
        <p>We’re sorry. There’s a problem with our system.</p>
        <p>
          To request refills, call the pharmacy number on your prescription
          label.
        </p>
      </va-alert>
      <va-alert
        visible={isPartiallySubmitted}
        id="partial-refill"
        status="error"
        setFocus
        uswds
        class={isPartiallySubmitted ? 'vads-u-margin-y--2' : ''}
      >
        <h2
          className="vads-u-margin-y--0 vads-u-font-size--h3"
          data-testid="failed-message-title"
        >
          Only part of your request was submitted
        </h2>
        <p data-testid="failed-message-description">
          We’re sorry. There’s a problem with our system. We couldn’t submit
          these refill requests:
        </p>
        <ul className="va-list--disc">
          {refillResult?.failedMeds.map((item, idx) => (
            <li
              className="vads-u-padding-y--0 vads-u-font-weight--bold"
              key={idx}
            >
              {item?.prescriptionName}
            </li>
          ))}
        </ul>
        <p
          className="vads-u-margin-bottom--0"
          data-testid="success-message-description"
        >
          Try requesting these refills again. If it still doesn’t work, call
          your VA pharmacy.
        </p>
      </va-alert>
      <va-alert
        visible={isSuccess}
        id="success-refill"
        status="success"
        setFocus
        uswds
        class={isSuccess ? 'vads-u-margin-y--2' : ''}
      >
        <h2
          className="vads-u-margin-y--0 vads-u-font-size--h3"
          data-testid="success-message-title"
        >
          Refills requested
        </h2>
        <ul className="va-list--disc">
          {refillResult?.successfulMeds.map((id, idx) => (
            <li
              className="vads-u-padding-y--0"
              data-testid="medication-requested"
              key={idx}
            >
              {id?.prescriptionName}
            </li>
          ))}
        </ul>
        <div
          className="vads-u-margin-y--0"
          data-testid="success-message-description"
        >
          <p>
            For updates on your refill requests, go to your medications list.
          </p>
          <Link
            data-testid="back-to-medications-page-link"
            to="/"
            className="hide-visited-link"
            data-dd-action-name={
              dataDogActionNames.refillPage
                .GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK
            }
          >
            Go to your medications list
          </Link>
        </div>
      </va-alert>
    </>
  );
};

RefillNotification.propTypes = {
  refillResult: PropTypes.object,
};

export default RefillNotification;
