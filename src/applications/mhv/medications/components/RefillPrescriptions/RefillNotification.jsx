import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RefillNotification = ({ refillResult = {} }) => {
  if (refillResult?.status !== 'finished') {
    return <></>;
  }
  return (
    <>
      {refillResult?.successfulMeds.length === 0 ? (
        <div className="vads-u-margin-y--1">
          <va-alert status="error" setFocus aria-live="polite" uswds>
            <h3
              className="vads-u-margin-y--0"
              data-testid="failed-message-title"
            >
              Request not submitted
            </h3>
            <p>We’re sorry. There’s a problem with our system.</p>
            <p>
              To request refills, call the pharmacy number on your prescription
              label.
            </p>
          </va-alert>
        </div>
      ) : (
        <>
          {refillResult?.failedMeds.length > 0 && (
            <div className="vads-u-margin-y--2">
              <va-alert status="error" setFocus aria-live="polite" uswds>
                <h3
                  className="vads-u-margin-y--0"
                  data-testid="failed-message-title"
                >
                  Only part of your request was submitted
                </h3>
                <p data-testid="failed-message-description">
                  We’re sorry. There’s a problem with our system. We couldn’t
                  submit these refill requests:
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
                  Try requesting these refills again. If it still doesn’t work,
                  call your VA pharmacy.
                </p>
              </va-alert>
            </div>
          )}
          <div className="vads-u-margin-y--2">
            <va-alert status="success" setFocus aria-live="polite" uswds>
              <h3
                className="vads-u-margin-y--0"
                data-testid="success-message-title"
              >
                Refill prescriptions
              </h3>
              <ul className="va-list--disc">
                {refillResult?.successfulMeds.map((id, idx) => (
                  <li className="vads-u-padding-y--0" key={idx}>
                    {id?.prescriptionName}
                  </li>
                ))}
              </ul>
              <p
                className="vads-u-margin-y--0"
                data-testid="success-message-description"
              >
                For updates on your refill requests, go to your medications
                list. <br />
                <Link data-testid="back-to-medications-page-link" to="/">
                  Go to your medications list
                </Link>
              </p>
            </va-alert>
          </div>
        </>
      )}
    </>
  );
};

RefillNotification.propTypes = {
  refillResult: PropTypes.object,
};

export default RefillNotification;
