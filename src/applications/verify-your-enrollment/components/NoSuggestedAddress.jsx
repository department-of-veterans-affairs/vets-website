import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BAD_UNIT_NUMBER, MISSING_UNIT_NUMBER } from '../constants';
import Alert from './Alert';
import { noSuggestedAddress } from '../helpers';

const NoSuggestedAddress = ({
  deliveryPointValidation,
  formData,
  setIsEnteredAddress,
}) => {
  const isThereNoSuggestedAddress = noSuggestedAddress(deliveryPointValidation);

  useEffect(
    () => {
      if (isThereNoSuggestedAddress) {
        setIsEnteredAddress('');
      }
    },
    [isThereNoSuggestedAddress, setIsEnteredAddress],
  );
  const alert = () => {
    if (deliveryPointValidation === BAD_UNIT_NUMBER) {
      return (
        <Alert
          status="warning"
          title="Confirm your address"
          message="U.S. Postal Service records show that there may be a problem with the unit number for this address. Confirm that you want us to use this address as you entered it. Or, cancel to edit the address."
        />
      );
    }
    if (deliveryPointValidation === MISSING_UNIT_NUMBER) {
      return (
        <Alert
          status="warning"
          title="Confirm your address"
          message="U.S. Postal Service records show this address may need a unit number. Confirm that you want us to use this address as you entered it. Or, go back to edit and add a unit number."
        />
      );
    }
    if (deliveryPointValidation === 'MISSING_ZIP') {
      return (
        <Alert
          status="warning"
          title="Confirm your address"
          message="We can’t confirm the address you entered with the U.S. Postal Service. Confirm that you want us to use this address as you entered it. Or, go back to edit it."
        />
      );
    }
    return null;
  };
  return (
    <div>
      {deliveryPointValidation !== undefined &&
        deliveryPointValidation !== 'CONFIRMED' && (
          <>
            {alert()}
            <div className="usa-radio vads-u-margin-top--2p5 12px vads-u-margin-bottom--2">
              <span className="vads-u-font-weight--bold">You entered:</span>
              <label
                className="usa-radio__label vads-u-margin-top--1"
                htmlFor="entered-address"
              >
                {`${formData.addressLine1} ${formData.addressLine2 || ''}`}
                <br />
                {`${formData.city}, ${formData.stateCode} ${formData.zipCode}`}
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
  setIsEnteredAddress: PropTypes.func,
};
export default NoSuggestedAddress;
