import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fillPrescription } from '../../actions/prescriptions';

const FillRefillButton = rx => {
  const dispatch = useDispatch();
  const [isAlertVisible, setAlertVisible] = useState(false);

  const {
    cmopDivisionPhone,
    dispensedDate,
    prescriptionId,
    refillRemaining,
    refillStatus,
  } = rx;

  if (
    refillStatus === 'expired' ||
    refillStatus === 'refillinprocess' ||
    refillRemaining === 0
  ) {
    return null;
  }
  if (refillStatus === 'active' || refillStatus === 'activeParked') {
    return (
      <div className="no-print">
        {/* TODO: Confirmation Message goes here */}
        <div hidden={!isAlertVisible}>
          <va-alert status="error" visible={isAlertVisible}>
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
        </div>
        <button
          className="vads-u-width--responsive"
          onClick={() => {
            setAlertVisible(dispatch(fillPrescription(prescriptionId)));
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
    isRefillable: PropTypes.bool,
    prescriptionId: PropTypes.number,
    refillStatus: PropTypes.string,
  }),
};

export default FillRefillButton;
