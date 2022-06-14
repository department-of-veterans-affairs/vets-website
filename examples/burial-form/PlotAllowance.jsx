import React from 'react';
import {
  TextField,
  Page,
  RadioGroup
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function PlotAllowance(props) {

  const formikContext = useFormikContext()
  
  return (
    <div className="vads-u-margin-x--1p5">
      <Page {...props}>
        <TextField required name="placeOfRemains" label="Place of burial or deceased Veteran’s remains" />
        <div className={'vads-u-padding-y--1p5 form-expanding-group' + (formikContext?.values?.federalCemetery === false && ' form-expanding-group-open')}>
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
          { formikContext?.values?.federalCemetery === false && (
            <div className='vads-u-padding-y--1p5'>
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
        </div>
        <div className={'vads-u-padding-y--1p5 form-expanding-group' + (formikContext?.values?.govtContributions && ' form-expanding-group-open')}>
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
          { formikContext?.values?.govtContributions && (
            <div className='vads-u-padding-y--1p5'>
              <TextField
                required 
                name="amountGovtContribution" 
                label="Amount of government or employer contribution." />
            </div>
          )}
        </div>
      </Page>
    </div>
  )
}