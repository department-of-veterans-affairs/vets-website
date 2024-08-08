import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { errorAddressAlert } from '../constants';
import { addressLabel, noSuggestedAddress } from '../helper';

const NoSuggestedAddress = ({
  deliveryPointValidation,
  formData,
  setChooseAddress,
}) => {
  // This Function checks if there suggested Address
  const isThereNoSuggestedAddress = noSuggestedAddress(deliveryPointValidation);
  // This Effect reset setChooseAddress to entered if there is no suggested address.
  useEffect(
    () => {
      if (isThereNoSuggestedAddress) {
        setChooseAddress('entered');
      }
    },
    [isThereNoSuggestedAddress, setChooseAddress],
  );

  return (
    <div>
      {deliveryPointValidation !== undefined &&
        deliveryPointValidation !== 'CONFIRMED' && (
          <>
            {errorAddressAlert(deliveryPointValidation)}
            <div className="usa-radio vads-u-margin-top--2p5 12px vads-u-margin-bottom--2">
              <span className="vads-u-font-weight--bold">You entered:</span>
              <label
                className="usa-radio__label vads-u-margin-top--1"
                htmlFor="entered-address"
              >
                {addressLabel(formData)}
              </label>
            </div>
          </>
        )}
    </div>
  );
};

NoSuggestedAddress.propTypes = {
  deliveryPointValidation: PropTypes.string,
  formData: PropTypes.object,
  setChooseAddress: PropTypes.func,
};
export default NoSuggestedAddress;
