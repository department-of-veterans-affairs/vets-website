import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AlertBox from '../AlertBox';

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
        headline={
          <h2 className="vads-u-font-size--h3 usa-alert-heading">{headline}</h2>
        }
        isVisible={!!schoolClosing}
        status="warning"
      />
    );
  }
  return null;
};

SchoolClosingHeading.propTypes = {
  schoolClosing: PropTypes.bool,
  schoolClosingOn: PropTypes.string,
};
export default SchoolClosingHeading;
