import React, { useState } from 'react';
import {
  VaCheckbox,
  VaSelect,
  VaTextInput,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import constants from 'vets-json-schema/dist/constants.json';
import UnsavedFieldNote from './UnsavedFieldNote';

const COUNTRY_VALUES = constants.countries.map(country => country.value);
const COUNTRY_NAMES = constants.countries.map(country => country.label);

const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);

// filtered States that include US territories
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

const EditAddress = ({ data, goToPath, setFormData }) => {
  const [address, setAddress] = useState(data.permanentAddress || {});

  const handleSubmit = event => {
    event.preventDefault();
    setFormData({ ...data, permanentAddress: address });
    goToPath('/contact-information');
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setAddress(prevAddress => ({ ...prevAddress, [name]: value }));
  };

  return (
    <div>
      <h2>Order medical supplies</h2>
      <h3>Contact information</h3>
      <UnsavedFieldNote fieldName="mailing address" />
      <form onSubmit={handleSubmit}>
        <VaCheckbox
          label="I live on a U.S. military base outside of the United States."
          onVaChange={e =>
            setAddress(prevAddress => ({
              ...prevAddress,
              isMilitary: e.detail.checked,
            }))
          }
          checked={address.isMilitary}
        />

        <VaSelect
          label="Country (Required)"
          name="country"
          value={address.country}
          onVaSelect={e =>
            handleInputChange({
              target: { name: 'country', value: e.detail.value },
            })
          }
          required
        >
          {COUNTRY_VALUES.map((value, index) => (
            <option key={value} value={value}>
              {COUNTRY_NAMES[index]}
            </option>
          ))}
        </VaSelect>

        <VaTextInput
          label="Street address (Required)"
          name="street"
          value={address.street}
          onVaInput={e =>
            handleInputChange({
              target: { name: 'street', value: e.target.value },
            })
          }
          required
        />

        <VaTextInput
          label="Street address line 2"
          name="street2"
          value={address.street2}
          onVaInput={e =>
            handleInputChange({
              target: { name: 'street2', value: e.target.value },
            })
          }
        />

        <VaTextInput
          label="City (Required)"
          name="city"
          value={address.city}
          onVaInput={e =>
            handleInputChange({
              target: { name: 'city', value: e.target.value },
            })
          }
          required
        />

        <VaSelect
          label="State (Required)"
          name="state"
          value={address.state}
          onVaSelect={e =>
            handleInputChange({
              target: { name: 'state', value: e.detail.value },
            })
          }
          required
        >
          {STATE_VALUES.map((value, index) => (
            <option key={value} value={value}>
              {STATE_NAMES[index]}
            </option>
          ))}
        </VaSelect>

        <VaTextInput
          label="Postal code (Required)"
          name="postalCode"
          value={address.postalCode}
          onVaInput={e =>
            handleInputChange({
              target: { name: 'postalCode', value: e.target.value },
            })
          }
          required
        />

        <div>
          <VaButton text="Update" onClick={handleSubmit} uswds />
          <VaButton
            text="Cancel"
            secondary
            onClick={() => goToPath('/contact-information')}
            uswds
          />
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
