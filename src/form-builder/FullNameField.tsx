import React from 'react';

import { Suffixes } from '../utils/constants'
import { FullNameProps } from './types';
import SelectField from './SelectField';
import TextField from './TextField';

const FullNameField = (props: FullNameProps): JSX.Element => {
  const fieldName = props.fieldName ? props.fieldName : 'fullName';

  return (
    <>
      <TextField
        id="firstName"
        name={`${fieldName}.firstName`}
        label="Your first Name"
        required />
      <TextField
        id="middleName"
        name={`${fieldName}.middleName`}
        label="Your middle Name"/>
      <TextField
        id="lastName"
        name={`${fieldName}.lastName`}
        label="Your last Name"
        required />
      <SelectField
        id="suffix"
        name={`${fieldName}.suffix`}
        label="Suffix">
          {Suffixes.map((suffix, idx) => <option key={`${idx}-${suffix}`}>{suffix}</option>)}
      </SelectField>
    </>
  );
};

export default FullNameField;
