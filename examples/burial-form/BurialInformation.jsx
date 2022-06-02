import React from 'react';
import { Page, DateField, TextField, RadioGroup } from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import { isBeforeDate } from './utils';

const LOCATIONS = [
    {label: "VA medical center", value:"vaMedicalCenter", key:1},
    {label: "State Veterans home", value:"stateVeteransHome", key:2},
    {label: "Nursing home under VA contract", value:"nursingHome", key:3},
    {label: "Other", value:"other", key:4},
]

const VALIDATION_STRING = 'Date of burial must be on or after the date of death';

export default function BurialInformation(props) {
    const state = useFormikContext();

    return (
        <Page {...props} nextPage="/military-history/service-periods" prevPage="/veteran-information">
            <DateField name="deathDate" label="Date of death" required />
            <DateField 
                name="burialDate" 
                label="Date of burial (includes cremation or internment)" 
                required 
                validate={isBeforeDate(state.values.burialDate, state.values.deathDate, VALIDATION_STRING)} 
            />
            <RadioGroup 
                name="locationOfDeath.location" 
                label="Where did the Veteran’s death occur?" 
                required 
                options={LOCATIONS} />
            {
                state.values.locationOfDeath.location === "other" && (
                    <TextField 
                        className="vads-u-border-color--primary-alt-light vads-u-border-left--4px vads-u-padding-left--2 vads-u-padding-y--0p5 vads-u-margin-left--neg2p5" 
                        name="locationOfDeath.other" 
                        label="Please specify"
                        required={state.values.locationOfDeath.location === 'other'}    
                    />
                )
            }
        </Page>
    )
}