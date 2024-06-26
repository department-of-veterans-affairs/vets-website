import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { errorAddressAlert } from '../constants';
import { addressLabel, noSuggestedAddress } from '../helpers';

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
            <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2p5">
              <span className="vads-u-font-weight--bold">
                Entered Addresses:
              </span>
              <label className="vads-u-margin-top--1" id="entered-address">
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
