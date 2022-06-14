import React from 'react';
import {
  DateField,
  Page,
  TextField
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import { isBeforeDate } from './utils';

export default function MilitaryServiceHistory(props) {

  const state = useFormikContext();

  const {from, to} = state.values.toursOfDuty[0].dateRange;

  return (
    <>
      <Page {...props}>
        <div className="usa-alert usa-alert-warning background-color-only">
          <span>
            <strong>Note:</strong> If you would rather upload a DD214 than enter dates
            here, you can do that later in the form.
          </span>
        </div>
        <h3>Service Periods</h3>
        <DateField name="toursOfDuty[0].dateRange.from"
          label="Service start date" />
        <DateField name="toursOfDuty[0].dateRange.to"
          label="Service end date" validate={isBeforeDate(to, from, "End of service must be after start of service")} />
        <TextField name="toursOfDuty[0].serviceBranch"
          label="Branch of service" />
        <TextField name="toursOfDuty[0].rank"
          label="Rank" />
        <TextField name="toursOfDuty[0].serviceNumber"
          label="Service number" />
        <TextField name="toursOfDuty[0].placeOfEntry"
          label="Place of entry" />
        <TextField name="toursOfDuty[0].placeOfSeparation"
          label="Place of separation" />
        <button type="button"
          className="usa-button-secondary va-growable-add-btn usa-button-disabled"
          disabled>
          Add another Service Period
        </button>
        <br />
      </Page>
    </>
  )
}