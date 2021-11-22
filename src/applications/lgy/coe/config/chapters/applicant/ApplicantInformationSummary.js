import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { connect } from 'react-redux';
import moment from 'moment';

const VeteranInformationComponent = ({
  user: {
    dob,
    userFullName: { first, last },
  },
}) => {
  let dateOfBirthFormatted = '-';
  if (dob) {
    dateOfBirthFormatted = moment(dob).format('MMMM Do YYYY');
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
    </dl>
  );
  return (
    <>
      {dob && first && last ? (
        <div>
          <p>This is the personal information we have on file for you.</p>
          <va-alert status="info">{alertContent}</va-alert>
          <p>
            <strong>Note:</strong> If you need to update your personal
            information, please call Veterans Benefits Assistance at{' '}
            <Telephone contact={CONTACTS.VA_BENEFITS} /> between 8:00 a.m. and
            9:00 p.m. ET Monday through Friday.
          </p>
        </div>
      ) : (
        <LoadingIndicator message="Loading your information..." />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(VeteranInformationComponent);
