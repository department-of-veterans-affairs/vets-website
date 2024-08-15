import React from 'react';
import {
  DateField,
  FullNameField,
  Page,
  SSNField,
  TextField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function VeteranInformation(props) {
  const state = useFormikContext();

  return (
    <>
      <Page
        {...props}
        nextPage="/veteran-information/burial"
        prevPage="/claimant-information"
        fieldNames={[
          'veteranFullName',
          'veteranSocialSecurityNumber',
          'vaFileNumber',
          'veteranDateOfBirth',
          'placeOfBirth',
        ]}
      >
        <FullNameField name="veteranFullName" />

        {state.values.vaFileNumber ? (
          <SSNField
            name="veteranSocialSecurityNumber"
            label="Social Security number (must have this or a VA file number)"
          />
        ) : (
          <SSNField
            name="veteranSocialSecurityNumber"
            label="Social Security number (must have this or a VA file number)"
            required
          />
        )}
        {state.values.veteranSocialSecurityNumber ? (
          <TextField
            name="vaFileNumber"
            label="VA file number (must have this or a Social Security number)"
          />
        ) : (
          <TextField
            name="vaFileNumber"
            label="VA file number (must have this or a Social Security number)"
            required
          />
        )}
        <DateField name="veteranDateOfBirth" label="Date of birth" required />
        <TextField
          name="placeOfBirth"
          label="Place of birth (city and state or foreign country)"
        />
      </Page>
    </>
  );
}
