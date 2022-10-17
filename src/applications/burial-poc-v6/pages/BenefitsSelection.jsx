import React from 'react';
import {
  Page,
  CheckboxFieldGroup,
  NumberField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

const checkboxProps = {
  label: 'What expenses did you incur for the Veteran’s burial?',
  name: 'benefitsSelection',
  required: true,
  options: [
    {
      name: 'benefitsSelection.burialAllowance',
      label: 'Burial allowance',
    },
    {
      name: 'benefitsSelection.plotAllowance',
      label:
        'Plot or interment allowance (Check this box if you incurred expenses for the plot to bury the Veteran’s remains.)',
    },
    {
      name: 'benefitsSelection.transportation',
      label:
        'Transportation expenses (Transportation of the Veteran’s remains from the place of death to the final resting place)',
    },
  ],
};

export default function BenefitsSelection(props) {
  const state = useFormikContext();

  return (
    <>
      <Page
        {...props}
        fieldNames={[
          'burialAllowance',
          'plotAllowance',
          'transportation',
          'amountIncurred',
        ]}
      >
        <CheckboxFieldGroup {...checkboxProps} />
        {!!state.values.benefitsSelection?.transportation && (
          <div
            className={
              state.values.benefitsSelection?.transportation === true
                ? 'form-expanding-group form-expanding-group-open'
                : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <NumberField
                  name="amountIncurred"
                  label="Transportation amount incurred"
                  required={!!state.values.benefitsSelection?.transportation}
                />
                <div className="vads-u-margin-y--2">
                  <va-alert>
                    <strong>Note: </strong>
                    At the end of the application, you will be asked to upload
                    documentation for the expenses you incurred for transporting
                    the Veteran’s remains.
                  </va-alert>
                </div>
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
}
