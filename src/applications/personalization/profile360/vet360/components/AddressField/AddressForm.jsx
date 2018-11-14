import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { focusElement } from '../../../../../../platform/utilities/ui';

import ErrorableSelect from '../../../../../letters/components/ErrorableSelect';
import ErrorableTextInput from '../../../../../letters/components/ErrorableTextInput';
import {
  STATE_CODE_TO_NAME,
  MILITARY_CITIES,
  MILITARY_STATES,
} from '../../../../../letters/utils/constants';

/**
 * Input component for an address.
 *
 * Validation is managed in the vet360 reducer
 */
class Address extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  componentDidMount() {
    focusElement('h5');
  }

  getAdjustedStateNames = () => {
    // Reformat the state name data so that it can be
    // accepted by ErrorableSelect,
    // e.g., from this: `IL: 'Illinois'`
    // to this: `{ value: 'Illinois', label: 'IL' }`
    const statesList = [];

    _.mapKeys(STATE_CODE_TO_NAME, (value, key) => {
      statesList.push({ label: value, value: key });
    });

    return statesList;
  };

  render() {
    const errorMessages = this.props.errorMessages;
    const isUSA = this.props.address.countryName === 'United States';
    const adjustedStateNames = this.getAdjustedStateNames();
    const isMilitaryState = MILITARY_STATES.has(this.props.address.stateCode);

    return (
      <div>
        <ErrorableSelect
          errorMessage={errorMessages.countryName}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
          value={this.props.address.countryName}
          required
          onValueChange={update => this.props.onInput('countryName', update)}
        />
        <ErrorableTextInput
          errorMessage={errorMessages.addressLine1}
          label="Street address"
          name="addressLine1"
          autocomplete="address-line1"
          charMax={100}
          value={this.props.address.addressLine1}
          required
          onValueChange={update => this.props.onInput('addressLine1', update)}
          onBlur={() => this.props.onBlur('addressLine1')}
        />
        <ErrorableTextInput
          label="Street address (optional)"
          name="addressLine2"
          autocomplete="address-line2"
          charMax={100}
          value={this.props.address.addressLine2}
          onValueChange={update => this.props.onInput('addressLine2', update)}
          onBlur={() => this.props.onBlur('addressLine2')}
        />
        <ErrorableTextInput
          label="Street address (optional)"
          name="addressLine3"
          autocomplete="address-line3"
          charMax={100}
          value={this.props.address.addressLine3}
          onValueChange={update => this.props.onInput('addressLine3', update)}
          onBlur={() => this.props.onBlur('addressLine3')}
        />

        {!isMilitaryState && (
          <ErrorableTextInput
            errorMessage={errorMessages.city}
            label={
              <span>
                City <em>(or APO/FPO/DPO)</em>
              </span>
            }
            name="city"
            autocomplete="address-level2"
            charMax={100}
            value={this.props.address.city}
            required
            onValueChange={update => this.props.onInput('city', update)}
            onBlur={() => this.props.onBlur('city')}
          />
        )}

        {/* Enforce city selection for Military States */}
        {isMilitaryState && (
          <ErrorableSelect
            errorMessage={errorMessages.city}
            label={
              <span>
                City <em>(or APO/FPO/DPO)</em>
              </span>
            }
            name="city"
            autocomplete="address-level2"
            options={Array.from(MILITARY_CITIES)}
            value={this.props.address.city}
            required
            onValueChange={update => this.props.onInput('city', update, true)}
          />
        )}

        {/* Hide the state for addresses that aren't in the US */}
        {isUSA && (
          <ErrorableSelect
            errorMessage={errorMessages.stateCode}
            label="State"
            name="state"
            autocomplete="address-level1"
            options={adjustedStateNames}
            value={this.props.address.stateCode}
            required
            onValueChange={update =>
              this.props.onInput('stateCode', update, true)
            }
          />
        )}

        {/* Hide the zip code for addresseses that aren't in the US */}
        {isUSA && (
          <ErrorableTextInput
            errorMessage={errorMessages.zipCode}
            additionalClass="usa-input-medium"
            label={'Zip code'}
            name="postalCode"
            charMax={5}
            autocomplete="postal-code"
            value={this.props.address.zipCode}
            required
            onValueChange={update => this.props.onInput('zipCode', update)}
            onBlur={() => this.props.onBlur('zipCode')}
          />
        )}

        {!isUSA && (
          <ErrorableTextInput
            errorMessage={errorMessages.province}
            label={'State/Province/Region'}
            name="province"
            autocomplete="international-postal-code"
            charMax={100}
            value={this.props.address.province}
            onValueChange={update => this.props.onInput('province', update)}
            onBlur={() => this.props.onBlur('province')}
          />
        )}

        {!isUSA && (
          <ErrorableTextInput
            errorMessage={errorMessages.internationalPostalCode}
            additionalClass="usa-input-medium"
            label={'International postal code'}
            name="internationalPostalCode"
            autocomplete="international-postal-code"
            value={this.props.address.internationalPostalCode}
            required
            onValueChange={update =>
              this.props.onInput('internationalPostalCode', update)
            }
            onBlur={() => this.props.onBlur('internationalPostalCode')}
          />
        )}
      </div>
    );
  }
}

const addressShape = PropTypes.shape({
  addressOne: PropTypes.string,
  addressTwo: PropTypes.string,
  addressThree: PropTypes.string,
  city: PropTypes.string,
  stateCode: PropTypes.string,
  countryName: PropTypes.string,
  zipCode: PropTypes.string,
  internationalPostalCode: PropTypes.string,
});

Address.propTypes = {
  onInput: PropTypes.func.isRequired,
  address: addressShape.isRequired,
  errorMessages: addressShape.isRequired,
  countries: PropTypes.array.isRequired,
};

export default Address;
