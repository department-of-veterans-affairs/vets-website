import React, { useEffect } from 'react';
import {
  Page,
  DateField,
  TextField,
  RadioGroup,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import { isBeforeDate } from '../utils';
import { VALIDATION_MESSAGE } from '../constants';

const LOCATIONS = [
  { label: 'VA medical center', value: 'vaMedicalCenter', key: 1 },
  { label: 'State Veterans home', value: 'stateVeteransHome', key: 2 },
  { label: 'Nursing home under VA contract', value: 'nursingHome', key: 3 },
  { label: 'Other', value: 'other', key: 4 },
];

export default function BurialInformation(props) {
  const { values, setFieldValue } = useFormikContext();

  useEffect(
    () => {
      if (values.locationOfDeath.location !== 'other') {
        setFieldValue('locationOfDeath.other', undefined);
      }
    },
    [values.locationOfDeath.location],
  );

  return (
    <Page
      {...props}
      fieldNames={['deathDate', 'burialDate', 'locationOfDeath']}
    >
      <DateField name="deathDate" label="Date of death" required />
      <DateField
        name="burialDate"
        label="Date of burial (includes cremation or internment)"
        required
        validate={isBeforeDate(
          values.burialDate,
          values.deathDate,
          VALIDATION_MESSAGE,
        )}
      />
      <RadioGroup
        name="locationOfDeath.location"
        label="Where did the Veteran’s death occur?"
        required
        options={LOCATIONS}
      />
      {values.locationOfDeath.location === 'other' && (
        <TextField
          className="vads-u-border-color--primary-alt-light vads-u-border-left--4px vads-u-padding-left--2 vads-u-padding-y--0p5 vads-u-margin-left--neg2p5"
          name="locationOfDeath.other"
          label="Please specify where the Veteran's death occurred"
          required={values.locationOfDeath.location === 'other'}
        />
      )}
    </Page>
  );
}
