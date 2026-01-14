import React from 'react';
import PropTypes from 'prop-types';
import { getImageUri } from '../../util/helpers';

const PrescriptionFillImage = ({ isFirstFill, prescriptionFill }) => {
  const { cmopNdcNumber, prescriptionName } = prescriptionFill || {};
  return (
    <>
      <h5
        className={`${
          isFirstFill ? 'vads-u-margin-top--2 ' : ''
        }vads-u-font-size--source-sans-normalized vads-u-font-family--sans vads-u-margin--0`}
        data-testid="med-image"
      >
        Image
      </h5>
      <div className="no-print">
        {cmopNdcNumber ? (
          <img
            alt={`Example of ${prescriptionName}`}
            className="vads-u-margin-top--1"
            data-testid="rx-image"
            src={getImageUri(cmopNdcNumber)}
            width="350"
            height="350"
          />
        ) : (
          <p className="vads-u-margin--0" data-testid="no-image">
            Image not available
          </p>
        )}
      </div>
    </>
  );
};

PrescriptionFillImage.propTypes = {
  isFirstFill: PropTypes.bool.isRequired,
  prescriptionFill: PropTypes.shape({
    cmopNdcNumber: PropTypes.string,
    prescriptionName: PropTypes.string.isRequired,
  }).isRequired,
};

export default PrescriptionFillImage;
