import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fillPrescription } from '../../actions/prescriptions';
import CallPharmacyPhone from './CallPharmacyPhone';

const FillRefillButton = rx => {
  const dispatch = useDispatch();

  const {
    cmopDivisionPhone,
    dispensedDate,
    error,
    prescriptionId,
    success,
    isRefillable,
  } = rx;

  if (isRefillable) {
    return (
      <div>
        {success && (
          <va-alert status="success" setFocus aria-live="polite">
            <p className="vads-u-margin-y--0">We got your request.</p>
          </va-alert>
        )}
        {error && (
          <>
            <va-alert
              status="error"
              setFocus
              id="fill-error-alert"
              aria-live="polite"
            >
              <p className="vads-u-margin-y--0">
                We didn’t get your request. Try again.
              </p>
            </va-alert>
            <p className="vads-u-margin-bottom--1 vads-u-margin-top--2">
              If it still doesn’t work, call your VA pharmacy
              <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
            </p>
          </>
        )}
        <button
          type="button"
          id="fill-or-refill-button"
          aria-describedby={`card-header-${prescriptionId}`}
          className="vads-u-width--responsive"
          data-testid="refill-request-button"
          hidden={success}
          onClick={() => {
            dispatch(fillPrescription(prescriptionId));
          }}
        >
          {`Request ${dispensedDate ? 'a refill' : 'the first fill'}`}
        </button>
      </div>
    );
  }

  return null;
};

FillRefillButton.propTypes = {
  rx: PropTypes.shape({
    cmopDivisionPhone: PropTypes.string,
    dispensedDate: PropTypes.string,
    error: PropTypes.object,
    prescriptionId: PropTypes.number,
    refillRemaining: PropTypes.number,
    success: PropTypes.bool,
    dispStatus: PropTypes.string,
  }),
};

export default FillRefillButton;
