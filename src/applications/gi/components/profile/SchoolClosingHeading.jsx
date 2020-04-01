import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const SchoolClosingHeading = ({ schoolClosing, schoolClosingOn }) => {
  if (schoolClosing) {
    const isFutureClosing =
      schoolClosingOn && moment(schoolClosingOn) > moment();
    const content = isFutureClosing
      ? 'School will be closing soon'
      : 'School has closed';
    const headline = isFutureClosing ? 'School closing' : 'School closed';
    return (
      <AlertBox
        content={<p>{content}</p>}
        headline={headline}
        isVisible={!!schoolClosing}
        status="warning"
      />
    );
  }
  return null;
};

export default SchoolClosingHeading;
