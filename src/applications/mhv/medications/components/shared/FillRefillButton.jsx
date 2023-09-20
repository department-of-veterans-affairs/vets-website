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
      <div className="no-print">
        {success && (
          <va-alert status="success">
            <p className="vads-u-margin-y--0">
              The fill request has been submitted successfully
            </p>
          </va-alert>
        )}
        {error && (
          <va-alert status="error">
            <p className="vads-u-margin-y--0">
              We didn’t get your [fill/refill] request. Try again.
            </p>
          </va-alert>
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
          {error && (
            <p className="vads-u-margin-y--0">
              If it still doesn’t work, call your VA pharmacy
              <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
            </p>
          )}
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
