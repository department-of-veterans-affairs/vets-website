import React from 'react';
import moment from '../../../../platform/startup/moment-setup';
import { fieldFailureMessage } from './LoadFail';

function Gender({ gender }) {
  if (gender) return <span>{gender === 'M' ? 'Male' : 'Female'}</span>;
  return fieldFailureMessage;
}

function BirthDate({ birthDate }) {
  if (birthDate) return <span>{moment(birthDate).format('MMM D, YYYY')}</span>;
  return fieldFailureMessage;
}

export default function PersonalInformation({ personalInformation: { gender, birthDate } }) {
  return (
    <div>
      <h3>Gender</h3>
      <Gender gender={gender}/>
      <h3>Birth date</h3>
      <BirthDate birthDate={birthDate}/>
    </div>
  );
}
