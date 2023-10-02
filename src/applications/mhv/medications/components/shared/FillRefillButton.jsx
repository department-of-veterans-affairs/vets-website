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

  const pharmacyPhone = () => {
    return (
      <p className="vads-u-margin-y--0">
        If it still doesn’t work, call your VA pharmacy
        <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
      </p>
    );
  };

  if (
    (dispStatus === 'Active' && refillRemaining !== 0) ||
    dispStatus === 'Active: Parked'
  ) {
    return (
      <div>
        {success && (
          <va-alert status="success" setFocus>
            <p className="vads-u-margin-y--0">
              The fill request has been submitted successfully
            </p>
          </va-alert>
        )}
        {error && (
          <>
            <va-alert status="error" setFocus>
              <p className="vads-u-margin-y--0">
                We didn’t get your [fill/refill] request. Try again.
              </p>
            </va-alert>
            <div className="vads-u-visibility--visible vads-u-margin-top--1 vads-u-margin-bottom--1 medium-screen:vads-u-visibility--hidden medium-screen:vads-u-margin-bottom--neg3">
              {pharmacyPhone()}
            </div>
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
        {error && (
          <div className="vads-u-visibility--hidden vads-u-margin-bottom--neg4 medium-screen:vads-u-visibility--visible medium-screen:vads-u-margin-bottom--0">
            {pharmacyPhone()}
          </div>
        )}
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
