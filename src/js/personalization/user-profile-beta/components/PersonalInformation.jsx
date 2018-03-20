import React from 'react';
import moment from '../../../common/utils/moment-setup';
import SSNWidget from '../../../common/schemaform/review/SSNWidget';

export default function PersonalInformation({ gender, dob, ssn, toursOfDuty }) {
  return (
    <div>
        <h3>Gender</h3>
        {gender === 'M' ? 'Male' : 'Female'}
        <h3>Birth date</h3>
        {moment(dob).format('MMM D, YYYY')}
        <h3>Social security number</h3>
        <SSNWidget value={ssn}/>
        <h2>Military Service</h2>
        {toursOfDuty.map((tour, index) => {
          return (
            <div key={index}>
              <h3>{tour.serviceBranch}</h3>
              <div>{moment(tour.dateRange.start).format('MMM D, YYYY')} &ndash; {moment(tour.dateRange.end).format('MMM D, YYYY')}</div>
            </div>
          );
        })}
    </div>
  );
}
