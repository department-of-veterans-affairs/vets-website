import React, { useEffect } from 'react';
import {
  TextField,
  DateField,
  DebuggerView,
  FullNameField,
  Page,
  RadioGroup
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function ClaimantInformation(props) {

  const formikContext = useFormikContext()
  
  return (
    <>
      <Page {...props} prevPage="/benefits/burial-allowance" nextPage="/claimant-contact-information">
        <TextField required name="placeOfRemains" label="Place of burial or deceased Veteran’s remains" />
        <RadioGroup
          name="federalCemetery"
          label="Was the Veteran buried in a national cemetary, or one owned by the federal government?"
          required
          options={
            [
              {label: "Yes", value: true, key: 1},
              {label: "No", value: false, key: 2}
            ]
          }
        />
        { formikContext?.values?.federalCemetery === "true" && (
          <div className='form-expanding-group-open'>
            <RadioGroup
              name="govtContributions"
              label="Did a federal/state government or the Veteran’s employer contribute to the burial? (Not including employer life insurance)"
              required
              options={
                [
                  {label: "Yes", value: true, key: 1},
                  {label: "No", value: false, key: 2}
                ]
              }
            />
            { formikContext?.values?.govtContributions === "true" && (
              <div className='form-expanding-group-open'>
                <TextField
                  required 
                  name="amountGovtContribution" 
                  label="Amount of government or employer contribution." />
              </div>
              )
            }
          </div>
        )}
        { formikContext?.values?.federalCemetery === "false" && (
          <div className='form-expanding-group-open'>
            <RadioGroup
              name="stateCemetery"
              label="Was the Veteran buried in a state veteran’s cemetary?"
              required
              options={
                [
                  {label: "Yes", value: true, key: 1},
                  {label: "No", value: false, key: 2}
                ]
              }
            />
          </div>
        )}
      </Page>
      <DebuggerView />
    </>
  )
}