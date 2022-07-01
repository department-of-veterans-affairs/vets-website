import React, { useEffect } from 'react';
import {
  FullNameField,
  Page,
  RadioGroup
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import { ExpandingGroupClass } from '../Constant';

export default function PreviousNames(props) {

  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values?.previousNames && values?.veteranServedUnderAnotherName === "false") {
      setFieldValue(`previousNames`, [])
    }
  }, [values?.veteranServedUnderAnotherName]);
  
  return (
    <>
      <Page {...props}>
        <div className={values?.veteranServedUnderAnotherName === "true" ? `${ExpandingGroupClass}` : ''}>
          <RadioGroup
            name="veteranServedUnderAnotherName"
            label="Did the Veteran serve under another name?"
            required
            options={
              [
                {label: "Yes", value: true, key: 1},
                {label: "No", value: false, key: 2},
              ]
            }
          />
          {
            values?.veteranServedUnderAnotherName === "true"
            ? (
              <>
                <FullNameField name="previousNames[0]"/>
                <button
                  className="btn usa-button usa-button-disabled">
                  Add another name
                </button>
              </>
            )
            : (
              null
            )
          }
        </div>
      </Page>
    </>
  )
}