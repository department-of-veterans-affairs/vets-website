import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { connect } from 'react-redux';
import moment from 'moment';

const VeteranInformationComponent = props => {
  let dateOfBirthFormatted = '';
  let genderFull = '';
  if (props.user && props.user.dob) {
    dateOfBirthFormatted = moment(props.user.dob).format('MMMM Do YYYY');
  }
  if (props.user && props.user.gender === 'M') {
    genderFull = 'Male';
  } else if (props.user && props.user.gender === 'F') {
    genderFull = 'Female';
  }
  const alertContent = (
    <>
      <p>
        <strong>
          {props.user.userFullName.first} {props.user.userFullName.last}
        </strong>
      </p>
      <p>Date of birth: {dateOfBirthFormatted}</p>
      <p>Gender: {genderFull}</p>
    </>
  );
  return (
    <div>
      <AlertBox content={alertContent} status="info" isVisible />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance at{' '}
        <a href="tel:800 827 1000">800-827-1000</a> between 8:00 a.m. and 9:00
        p.m. ET Monday through Friday.
      </p>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(VeteranInformationComponent);
