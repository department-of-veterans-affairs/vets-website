import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fillPrescription } from '../../actions/prescriptions';

const FillRefillButton = rx => {
  const dispatch = useDispatch();

  const {
    cmopDivisionPhone,
    dispensedDate,
    error,
    prescriptionId,
    refillRemaining,
    refillStatus,
    success,
    isRefillable,
  } = rx;

  if (
    !isRefillable ||
    refillStatus === 'expired' ||
    refillStatus === 'refillinprocess' ||
    refillRemaining === 0
  ) {
    return null;
  }
  if (refillStatus === 'active' || refillStatus === 'activeParked') {
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
              We didn’t get your refill request. Try again.
            </p>
            <p className="vads-u-margin-y--0">
              If it still doesn’t work, call your VA pharmacy
              {cmopDivisionPhone ? (
                <>
                  <span> at </span>
                  <va-telephone contact={cmopDivisionPhone} />
                  <span>
                    (<va-telephone tty contact="711" />)
                  </span>
                </>
              ) : (
                <>.</>
              )}
            </p>
          </va-alert>
        )}
        <button
          className="vads-u-width--responsive"
          disabled={success}
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
    refillStatus: PropTypes.string,
    success: PropTypes.bool,
    isRefillable: PropTypes.bool,
  }),
};

export default FillRefillButton;
