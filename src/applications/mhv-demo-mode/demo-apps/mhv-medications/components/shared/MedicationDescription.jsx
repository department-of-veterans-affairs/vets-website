import React from 'react';
import PropTypes from 'prop-types';

import VaPharmacyText from './VaPharmacyText';

const MedicationDescription = ({
  backImprint,
  color,
  frontImprint,
  shape,
  pharmacyPhone,
}) => {
  return (
    <>
      {shape?.trim() && color?.trim() && frontImprint?.trim() ? (
        <>
          <p className="vads-u-margin--0">
            <strong>Note:</strong> If the medication you’re taking doesn’t match
            description, call <VaPharmacyText phone={pharmacyPhone} />.
          </p>
          <ul className="vads-u-margin--0">
            <li className="vads-u-margin-y--0" data-testid="rx-shape">
              <strong>Shape:</strong> {shape[0].toUpperCase()}
              {shape.slice(1).toLowerCase()}
            </li>
            <li className="vads-u-margin-y--0" data-testid="rx-color">
              <strong>Color:</strong> {color[0].toUpperCase()}
              {color.slice(1).toLowerCase()}
            </li>
            <li className="vads-u-margin-y--0" data-testid="rx-front-marking">
              <strong>Front marking:</strong> {frontImprint}
            </li>
            {backImprint ? (
              <li className="vads-u-margin-y--0" data-testid="rx-back-marking">
                <strong>Back marking:</strong> {backImprint}
              </li>
            ) : (
              <></>
            )}
          </ul>
        </>
      ) : (
        <>
          No description available. Call{' '}
          <VaPharmacyText phone={pharmacyPhone} /> if you need help identifying
          this medication.
        </>
      )}
    </>
  );
};

MedicationDescription.propTypes = {
  pharmacyPhone: PropTypes.string.isRequired,
  backImprint: PropTypes.string,
  color: PropTypes.string,
  frontImprint: PropTypes.string,
  shape: PropTypes.string,
};

export default MedicationDescription;
