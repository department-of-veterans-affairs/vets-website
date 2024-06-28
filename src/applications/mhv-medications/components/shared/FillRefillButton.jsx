import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fillPrescription } from '../../actions/prescriptions';
import CallPharmacyPhone from './CallPharmacyPhone';
import { DD_ACTIONS_PAGE_TYPE } from '../../util/constants';
import { pharmacyPhoneNumber } from '../../util/helpers';

const FillRefillButton = rx => {
  const dispatch = useDispatch();

  const { dispensedDate, error, prescriptionId, success, isRefillable } = rx;

  const [isLoading, setIsLoading] = useState(false);
  const hasBeenDispensed =
    dispensedDate || rx.rxRfRecords?.find(record => record.dispensedDate);
  const pharmacyPhone = pharmacyPhoneNumber(rx);

  useEffect(
    () => {
      if (success || error) {
        setIsLoading(false);
      }
    },
    [success, error],
  );

  if (isRefillable) {
    return (
      <div className="rx-fill-refill-button" data-testid="fill-refill">
        {success && (
          <va-alert status="success" setFocus aria-live="polite" uswds>
            <p className="vads-u-margin-y--0" data-testid="success-message">
              We got your request to {`${dispensedDate ? 'refill' : 'fill'}`}{' '}
              this prescription.
            </p>
          </va-alert>
        )}
        {error &&
          !isLoading && (
            <>
              <va-alert
                status="error"
                setFocus
                id="fill-error-alert"
                data-testid="error-alert"
                aria-live="polite"
                uswds
              >
                <p className="vads-u-margin-y--0" data-testid="error-message">
                  We didn’t get your request. Try again.
                </p>
              </va-alert>
              <p className="vads-u-margin-bottom--1 vads-u-margin-top--2">
                If it still doesn’t work, call your VA pharmacy
                <CallPharmacyPhone
                  cmopDivisionPhone={pharmacyPhone}
                  page={DD_ACTIONS_PAGE_TYPE.LIST}
                />
              </p>
            </>
          )}
        {isLoading && (
          <va-loading-indicator
            message="Submitting your request..."
            set-focus
            data-testid="refill-loader"
          />
        )}
        <VaButton
          uswds
          type="button"
          className="va-button vads-u-padding-y--0p5"
          id={`fill-or-refill-button-${rx.prescriptionId}`}
          aria-describedby={`card-header-${prescriptionId}`}
          data-dd-action-name={`Fill Or Refill Button - ${
            DD_ACTIONS_PAGE_TYPE.LIST
          }`}
          data-testid="refill-request-button"
          hidden={success || isLoading}
          onClick={() => {
            setIsLoading(true);
            dispatch(fillPrescription(prescriptionId));
          }}
          text={`Request ${hasBeenDispensed ? 'a refill' : 'the first fill'}`}
        />
      </div>
    );
  }

  return null;
};

FillRefillButton.propTypes = {
  rx: PropTypes.shape({
    dispensedDate: PropTypes.string,
    error: PropTypes.object,
    prescriptionId: PropTypes.number,
    refillRemaining: PropTypes.number,
    success: PropTypes.bool,
    dispStatus: PropTypes.string,
  }),
};

export default FillRefillButton;
