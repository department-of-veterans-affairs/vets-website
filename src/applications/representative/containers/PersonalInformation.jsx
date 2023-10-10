import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const PersonalInformation = ({
  user: {
    dob,
    userFullName: { first, last },
  },
}) => {
  let dateOfBirthFormatted = '-';
  if (dob) {
    dateOfBirthFormatted = moment(dob).format('MMMM DD, YYYY');
  }

  return (
    <>
      {dob && first && last ? (
        <>
          <p>This is the personal information we have on file for you:</p>
          <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-padding-left--2 vads-u-margin-y--3">
            <p className="vads-u-margin-y--1">
              <strong>
                {first} {last}
              </strong>
            </p>
            <p>Date of birth: {dateOfBirthFormatted}</p>
          </div>
          <p>
            <strong>Note:</strong> If you need to update your personal
            information, please call Veterans Benefits Assistance at{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} /> Monday through
            Friday, between 8:00 a.m. and 9:00 p.m. ET.
          </p>
        </>
      ) : (
        <va-loading-indicator message="Loading your information..." />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(PersonalInformation);
