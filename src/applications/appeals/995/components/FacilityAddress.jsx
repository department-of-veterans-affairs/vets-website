import React from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { countries, states } from 'platform/forms/address';

export const FacilityAddress = ({
  currentData,
  content,
  handlers,
  showError,
}) => {
  const hasStates =
    states[(currentData.providerFacilityAddress?.country)] || [];
  return (
    <>
      <VaSelect
        id="country"
        name="country"
        label={content.addressLabels.country}
        required
        value={currentData.providerFacilityAddress?.country}
        onVaSelect={handlers.onChange}
        onBlur={handlers.onBlur}
        error={showError('country')}
        uswds
      >
        {countries.map(country => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </VaSelect>
      <VaTextInput
        id="street"
        name="street"
        type="text"
        label={content.addressLabels.street}
        required
        value={currentData.providerFacilityAddress?.street}
        onInput={handlers.onChange}
        onBlur={handlers.onBlur}
        error={showError('street')}
        autocomplete="section-provider address-line1"
        uswds
      />
      <VaTextInput
        id="street2"
        name="street2"
        type="text"
        label={content.addressLabels.street2}
        value={currentData.providerFacilityAddress?.street2}
        onInput={handlers.onChange}
        autocomplete="section-provider address-line2"
        uswds
      />
      <VaTextInput
        id="city"
        name="city"
        type="text"
        label={content.addressLabels.city}
        required
        value={currentData.providerFacilityAddress?.city}
        onInput={handlers.onChange}
        onBlur={handlers.onBlur}
        error={showError('city')}
        autocomplete="section-provider address-level2"
        uswds
      />
      {hasStates.length ? (
        <VaSelect
          id="state"
          name="state"
          label={content.addressLabels.state}
          required
          value={currentData.providerFacilityAddress?.state}
          onVaSelect={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('state')}
          uswds
        >
          {hasStates.map(state => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </VaSelect>
      ) : (
        <VaTextInput
          id="state"
          name="state"
          type="text"
          label={content.addressLabels.state}
          required
          value={currentData.providerFacilityAddress?.state}
          onInput={handlers.onChange}
          onBlur={handlers.onBlur}
          error={showError('state')}
          autocomplete="section-provider address-level1"
          uswds
        />
      )}

      <VaTextInput
        id="postal"
        name="postal"
        type="text"
        label={content.addressLabels.postal}
        required
        value={currentData.providerFacilityAddress?.postalCode}
        onInput={handlers.onChange}
        onBlur={handlers.onBlur}
        error={showError('postal')}
        inputmode="numeric"
        autocomplete="section-provider postal-code"
        uswds
      />
    </>
  );
};

FacilityAddress.propTypes = {
  content: PropTypes.shape({
    addressLabels: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      street: PropTypes.string,
      street2: PropTypes.string,
      postal: PropTypes.string,
    }),
    issuesLabel: PropTypes.string,
    toLabel: PropTypes.string,
  }),
  currentData: PropTypes.shape({
    providerFacilityAddress: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      street: PropTypes.string,
      street2: PropTypes.string,
      postalCode: PropTypes.string,
    }),
  }),
  dateRangeKey: PropTypes.string,
  handlers: PropTypes.shape({
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onIssueChange: PropTypes.func,
  }),
  isInvalid: PropTypes.func,
  showError: PropTypes.func,
};
