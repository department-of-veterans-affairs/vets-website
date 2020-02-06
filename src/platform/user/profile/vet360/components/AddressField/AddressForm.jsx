import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import { focusElement } from 'platform/utilities/ui';

import ErrorableSelect from 'applications/letters/components/ErrorableSelect';
import ErrorableTextInput from 'applications/letters/components/ErrorableTextInput';
import {
  STATE_CODE_TO_NAME,
  MILITARY_CITIES,
  MILITARY_STATES,
} from 'applications/letters/utils/constants';

/**
 * Input component for an address.
 *
 * Validation is managed in the vet360 reducer
 */
class AddressForm extends React.Component {
  state = {
    isMilitaryAddress: false,
    addressFromRedux: {
      stateCode: this.props.address.stateCode,
      city: this.props.address.city,
      countryName: this.props.address.countryName,
      zipCode: this.props.address.zipCode,
    },
  };

  // eslint-disable-next-line
  UNSAFE_componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  componentDidMount() {
    focusElement('h5');
  }

  onChange = async () => {
    const { onInput } = this.props;
    const {
      stateCode,
      city,
      countryName,
      zipCode,
    } = this.state.addressFromRedux;
    if (this.state.isMilitaryAddress) {
      // If military base is unchecked, we don't want the user to lose their previously entered data
      await onInput('countryName', countryName);
      await onInput('city', city);
      await onInput('stateCode', stateCode);
      await onInput('zipCode', zipCode);
    } else {
      // Set fields back to empty to force field validation.
      await onInput('countryName', 'United States');
      await onInput('city', null);
      await onInput('stateCode', null);
      await onInput('zipCode', null);
    }
    this.setState({ isMilitaryAddress: !this.state.isMilitaryAddress });
  };

  getAdjustedStateNames = () => {
    // Reformat the state name data so that it can be
    // accepted by ErrorableSelect,
    // e.g., from this: `IL: 'Illinois'`
    // to this: `{ value: 'Illinois', label: 'IL' }`
    const statesList = [];

    _.mapKeys(STATE_CODE_TO_NAME, (value, key) => {
      statesList.push({ label: value, value: key });
    });
    if (this.state.isMilitaryAddress) {
      return statesList.filter(state => MILITARY_STATES.has(state.value));
    }

    return statesList;
  };

  getCountryOptions = () => {
    if (this.state.isMilitaryAddress) {
      return ['United States'];
    }
    return this.props.countries;
  };

  getStateCode = () => {
    if (this.state.isMilitaryAddress) {
      return MILITARY_STATES.has(this.props.address.stateCode)
        ? this.props.address.stateCode
        : null;
    }
    return this.props.address.stateCode;
  };

  getCityName = () => {
    if (this.state.isMilitaryAddress) {
      return MILITARY_CITIES.has(this.props.address.city)
        ? this.props.address.city
        : null;
    }
    return this.props.address.city;
  };

  render() {
    const errorMessages = this.props.errorMessages;
    const isUSA = this.props.address.countryName === 'United States';
    const adjustedStateNames = this.getAdjustedStateNames();
    const isMilitaryState =
      MILITARY_STATES.has(this.props.address.stateCode) ||
      this.state.isMilitaryAddress;
    const { isMailingAddress } = this.props;

    return (
      <div>
        {isMailingAddress && (
          <div className="form-checkbox">
            <input
              type="checkbox"
              name="is-military-base-mailing-address"
              id="is-military-base-mailing-address"
              autoComplete="false"
              checked={this.state.isMilitaryAddress}
              onChange={this.onChange}
            />
            <label
              className="vads-u-margin-top--1p5"
              htmlFor="is-military-base-mailing-address"
            >
              I live on a United States military base outside of the United
              States.
            </label>
            <div className="vads-u-padding-x--2p5">
              <AdditionalInfo
                lassName="vads-u-margin-left--0"
                status="info"
                triggerText="Learn more about military base addresses"
              >
                <span>
                  The United States is automatically chosen as your country if
                  you live on a military base outside of the country.
                </span>
              </AdditionalInfo>
            </div>
          </div>
        )}
        <ErrorableSelect
          errorMessage={errorMessages.countryName}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.getCountryOptions()}
          value={this.props.address.countryName}
          disabled={this.state.isMilitaryAddress}
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
          label="Street address"
          name="addressLine2"
          autocomplete="address-line2"
          charMax={100}
          value={this.props.address.addressLine2}
          onValueChange={update => this.props.onInput('addressLine2', update)}
          onBlur={() => this.props.onBlur('addressLine2')}
        />
        <ErrorableTextInput
          label="Street address"
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
            label={<span>City</span>}
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
            label={<span>APO/FPO/DPO</span>}
            name="city"
            autocomplete="address-level2"
            options={Array.from(MILITARY_CITIES)}
            value={this.getCityName()}
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
            value={this.getStateCode()}
            required
            onValueChange={update =>
              this.props.onInput('stateCode', update, true)
            }
          />
        )}

        {/* Hide the zip code for addresses that aren't in the US */}
        {isUSA && (
          <ErrorableTextInput
            errorMessage={errorMessages.zipCode}
            additionalClass="usa-input-medium"
            label={'Postal code'}
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

AddressForm.propTypes = {
  isMailingAddress: PropTypes.bool.isRequired,
  onInput: PropTypes.func.isRequired,
  address: addressShape.isRequired,
  errorMessages: addressShape.isRequired,
  countries: PropTypes.array.isRequired,
};

export default AddressForm;
