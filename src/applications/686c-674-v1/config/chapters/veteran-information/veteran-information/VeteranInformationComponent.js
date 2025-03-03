import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { connect } from 'react-redux';
import moment from 'moment';

const VeteranInformationComponent = ({
  user: {
    gender,
    dob,
    userFullName: { first, last },
  },
}) => {
  let dateOfBirthFormatted = '-';
  let genderFull = '-';
  if (dob) {
    dateOfBirthFormatted = moment(dob).format('MMMM DD, YYYY');
  }
  if (gender === 'M') {
    genderFull = 'Male';
  } else if (gender === 'F') {
    genderFull = 'Female';
  }
  const alertContent = (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-line-height--4 vads-u-padding-bottom--2 vads-u-font-size--base">
        <strong>
          {first} {last}
        </strong>
      </dt>
      <dd className="vads-u-line-height--4 vads-u-padding-bottom--2 vads-u-font-size--base">
        Date of birth: {dateOfBirthFormatted}
      </dd>
      <dd className="vads-u-line-height--4 vads-u-font-size--base">
        Gender: {genderFull}
      </dd>
    </dl>
  );
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <va-alert status="info" uswds="false">
        {alertContent}
      </va-alert>
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        call Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> between 8:00 a.m. and
        9:00 p.m. ET Monday through Friday.
      </p>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(VeteranInformationComponent);
