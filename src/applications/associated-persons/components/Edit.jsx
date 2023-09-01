import React from 'react';
import { suffixes } from '@department-of-veterans-affairs/platform-static-data/options-for-select';
import constants from 'vets-json-schema/dist/constants.json';

let { countries, states } = constants;

const headings = {
  'nextOfKinPrimary': 'Next-of-Kin, Primary',
  'nextOfKinOther': 'Next-of-Kin, Other',
  'emergencyContactPrimary': 'Emergency Contact, Primary',
  'emergencyContactOther': 'Emergency Contact, Other'
};
const Edit = ({ variant }) => {
  return (
    <form>
      <h2>{headings[variant]}</h2>
      <h3>Name</h3>
      <va-text-input label="First name" name="givenName" />
      <va-text-input label="Middle name" name="middleName" />
      <va-text-input label="Last name" name="familyName" />
      <va-select label="Suffix" name="suffix">
        <option value=""></option>
        {suffixes.map(suffix => <option value={suffix}>{suffix}</option>)}
      </va-select>

      <h3>Address</h3>
      <va-select label="Country" name="country">
        {countries.map(({ label, value }) => <option value={value}>{label}</option>)}
      </va-select>
      <va-text-input label="Street address" name="addressLine1" />
      <va-text-input label="Street address (line 2)" name="addressLine2" />
      <va-text-input label="Street address (line 3)" name="addressLine3" />
      <va-text-input label="City" name="city" />
      <va-select label="State" name="state">
        <option value=""></option>
        {states.USA.map(({ label, value }) => <option value={value}>{label}</option>)}
      </va-select>
      <va-text-input label="Zip code" name="zipCode" />
      <va-text-input label="Phone number" name="primaryPhone" />

      <div class="vads-l-row vads-u-justify-content--flex-end">
        <va-button text="Save" />
      </div>
    </form>
  )
};

export default Edit;
