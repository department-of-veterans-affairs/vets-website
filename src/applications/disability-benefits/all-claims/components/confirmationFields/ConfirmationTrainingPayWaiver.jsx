import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationTrainingPayWaiver = ({ formData }) => {
  // These labels are switched in the form with yesNoReverse, so here they are reversed to match the form
  const labels = {
    N:
      'I don’t want to get VA compensation pay for the days I receive training pay.',
    Y: 'I want to get VA compensation pay instead of training pay.',
  };
  if (formData?.hasTrainingPay) {
    return (
      <li>
        <h4>Training pay waiver</h4>
        <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
          <li>
            {formData.waiveTrainingPay ? (
              <>
                <div className="vads-u-color--gray">Selected</div>
                <div>{labels.Y}</div>
              </>
            ) : (
              <>
                <div className="vads-u-color--gray">Not selected</div>
                <div>{labels.N}</div>
              </>
            )}
          </li>
        </ul>
      </li>
    );
  }
  return null;
};
ConfirmationTrainingPayWaiver.propTypes = {
  formData: PropTypes.shape({
    hasTrainingPay: PropTypes.bool,
    waiveTrainingPay: PropTypes.bool,
  }),
};

export default ConfirmationTrainingPayWaiver;
