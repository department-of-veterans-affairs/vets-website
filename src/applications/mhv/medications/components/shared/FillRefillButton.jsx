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
    refillRemaining,
    dispStatus,
    success,
  } = rx;

  if (
    (dispStatus === 'Active' && refillRemaining !== 0) ||
    dispStatus === 'Active: Parked'
  ) {
    return (
      <div>
        {success && (
          <va-alert status="success" setFocus>
            <p className="vads-u-margin-y--0">
              We got your {dispensedDate ? 'refill' : 'fill'} request.
            </p>
          </va-alert>
        )}
        {error && (
          <>
            <va-alert status="error" setFocus id="fill-error-alert">
              <p className="vads-u-margin-y--0">
                We didn’t get your {dispensedDate ? 'refill' : 'fill'} request.
                Try again.
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
          aria-describedby={`card-header-${prescriptionId}`}
          className="vads-u-width--responsive"
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
