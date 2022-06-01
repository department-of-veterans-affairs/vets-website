import React, { useEffect } from 'react';
import {
  DateField,
  Page,
  TextField,
  DebuggerView
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function MilitaryServiceHistory(props) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });

  const state = useFormikContext();

  const isBeforeStartDate = (value) => {
    if (state.values.toursOfDuty[0].dateRange.from >= value && value.length === 10) {
      return "End of service must be after start of service";
    }
  };

  return (
    <>
      <Page {...props} nextPage="/military-history/previous-names" prevPage="/veteran-information">
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
          label="Service end date" validate={isBeforeStartDate} />
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
      <DebuggerView />
    </>
  )
}