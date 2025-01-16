import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { formatSuggestedAddress } from '../utils/helpers';
import { ValidateAddressTitle } from './PreparerHelpers';

export default function SuggestedAddressRadio({
  title,
  userAddress,
  selectedAddress,
  addressValidation,
  onChangeSelectedAddress,
}) {
  return (
    <div
      className="va-profile-wrapper"
      id={`edit-${FIELD_NAMES.MAILING_ADDRESS}`}
    >
      <ValidateAddressTitle title={title} />
      <p>We found a similar address to the one you entered.</p>
      <VaRadio
        label="Tell us which address you’d like to use."
        onVaValueChange={onChangeSelectedAddress}
        required
      >
        {userAddress && (
          <va-radio-option
            key="userAddress"
            name="addressGroup"
            label="Address you entered:"
            description={formatSuggestedAddress(userAddress)}
            value={JSON.stringify(userAddress)}
            tile
            checked={
              JSON.stringify(selectedAddress) === JSON.stringify(userAddress)
            }
          />
        )}
        {addressValidation?.confirmedSuggestions?.[0] && (
          <va-radio-option
            key="suggestedAddress"
            name="addressGroup"
            label="Suggested address:"
            description={formatSuggestedAddress(
              addressValidation?.confirmedSuggestions?.[0],
            )}
            value={JSON.stringify(addressValidation?.confirmedSuggestions?.[0])}
            tile
            checked={
              JSON.stringify(selectedAddress) ===
              JSON.stringify(addressValidation?.confirmedSuggestions?.[0])
            }
          />
        )}
      </VaRadio>
    </div>
  );
}
