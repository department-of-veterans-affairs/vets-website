import React from 'react';
// import { suffixes } from '@department-of-veterans-affairs/platform-static-data/options-for-select';
import constants from 'vets-json-schema/dist/constants.json';

const { countries, states } = constants;

const Edit = ({
  givenName,
  // middleName,
  familyName,
  relationship,
  addressLine1,
  city,
  state,
  zipCode,
  primaryPhone,
  alternatePhone,
  handleSubmit,
}) => {
  return (
    <form>
      <div>
        This person is who you’d like to represent your wishes for care and
        medical documentation if needed.
      </div>
      <h3>Name</h3>
      <va-text-input label="First name" name="givenName" value={givenName} />
      {/* <va-text-input label="Middle name" name="middleName" value={middleName} /> */}
      <va-text-input label="Last name" name="familyName" value={familyName} />
      {/* <va-select label="Suffix" name="suffix">
        <option value=""></option>
        {suffixes.map(suffix => <option value={suffix}>{suffix}</option>)}
      </va-select> */}

      <h3>Relationship</h3>
      <va-text-input
        label="Relationship"
        name="relationship"
        value={relationship}
      />

      <h3>Address</h3>
      <va-select label="Country" name="country">
        {countries.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </va-select>
      <va-text-input
        label="Street address"
        name="addressLine1"
        value={addressLine1}
      />
      {/* <va-text-input label="Street address (line 2)" name="addressLine2" /> */}
      {/* <va-text-input label="Street address (line 3)" name="addressLine3" /> */}
      <va-text-input label="City" name="city" value={city} />
      <va-select label="State" name="state" value={state}>
        <option value="" />
        {states.USA.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </va-select>
      <va-text-input label="Zip code" name="zipCode" value={zipCode} />

      <h3>Telephone</h3>
      <va-text-input label="Phone" name="primaryPhone" value={primaryPhone} />
      <va-text-input
        label="Work phone"
        name="alternatePhone"
        value={alternatePhone}
      />

      <div className="vads-l-row vads-u-justify-content--flex-end">
        <va-button text="Save" onClick={handleSubmit} />
      </div>
    </form>
  );
};

Edit.defaultProps = {
  givenName: 'Jonnie',
  familyName: 'Shaye',
  relationship: 'Brother',
  addressLine1: '123 Main St, Ste 234',
  city: 'Los Angeles',
  state: 'CA',
  zipCode: '90089',
  primaryPhone: '111-222-3333',
  alternatePhone: '111-333-4444',
};

export default Edit;
