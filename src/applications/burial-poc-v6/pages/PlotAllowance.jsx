import React from 'react';
import {
  TextField,
  Page,
  RadioGroup,
  NumberField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import ExpandingGroup from '../components/ExpandingGroup';

export default function PlotAllowance(props) {
  const formikContext = useFormikContext();

  return (
    <div className="vads-u-margin-x--1p5">
      <Page
        {...props}
        title="Plot or interment allowance"
        fieldNames={[
          'placeOfRemains',
          'federalCemetery',
          'stateCemetery',
          'govtContributions',
          'amountGovtContribution',
        ]}
      >
        <TextField
          required
          name="placeOfRemains"
          label="Place of burial or deceased Veteran’s remains"
        />
        <div>
          <RadioGroup
            name="federalCemetery"
            label="Was the Veteran buried in a national cemetery, or one owned by the federal government?"
            required
            options={[
              { label: 'Yes', value: true, key: 1 },
              { label: 'No', value: false, key: 2 },
            ]}
          />
          {formikContext?.values?.federalCemetery === 'false' && (
            <ExpandingGroup open showPlus>
              <div className="vads-u-padding-y--1p5">
                <RadioGroup
                  name="stateCemetery"
                  label="Was the Veteran buried in a state Veteran’s cemetery?"
                  required
                  options={[
                    { label: 'Yes', value: true, key: 1 },
                    { label: 'No', value: false, key: 2 },
                  ]}
                />
              </div>
            </ExpandingGroup>
          )}
        </div>
        <div>
          <RadioGroup
            name="govtContributions"
            label="Did a federal/state government or the Veteran’s employer contribute to the burial? (Not including employer life insurance)"
            required
            options={[
              { label: 'Yes', value: true, key: 1 },
              { label: 'No', value: false, key: 2 },
            ]}
          />
          {formikContext?.values?.govtContributions === 'true' && (
            <ExpandingGroup open showPlus>
              <div className="vads-u-padding-y--1p5">
                <NumberField
                  required
                  name="amountGovtContribution"
                  label="Amount of government or employer contribution."
                />
              </div>
            </ExpandingGroup>
          )}
        </div>
      </Page>
    </div>
  );
}
