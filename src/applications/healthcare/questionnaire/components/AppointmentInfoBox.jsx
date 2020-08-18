import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import React from 'react';
import { connect } from 'react-redux';

const AppointmentInfoBox = props => {
  const {
    userFullName,
    dateOfBirth,
    gender,
    address,
    homePhone,
    mobilePhone,
  } = props;

  // eslint-disable-next-line no-console
  console.log({
    userFullName,
    dateOfBirth,
    gender,
    address,
    homePhone,
    mobilePhone,
  });

  return (
    <div>
      <p>This is formation is for you appointment at.....</p>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--1">
          <p className="vads-u-margin--1px vads-u-font-weight--bold" />
          <p className="vads-u-margin--1px">
            Date of birth: {moment(dateOfBirth).format('MMMM DD, YYYY')}
          </p>
          <p className="vads-u-margin--1px">
            Gender: {gender ? genderLabels[gender] : 'UNKNOWN'}
          </p>
        </div>
      </div>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> If you need to
        update your personal information, please call Veterans Benefits
        Assistance at <a href="tel:800-827-1000">800-827-1000</a>, Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

const mapStateToProps = state => ({
  userFullName: state.user?.profile?.userFullName,
  dateOfBirth: state.user?.profile?.dob,
  gender: state.user?.profile?.gender,
  address: state.user?.profile?.vet360?.residentialAddress,
  homePhone: state.user?.profile?.vet360?.homePhone,
  mobilePhone: state.user?.profile?.vet360?.mobilePhone,
});

export default connect(
  mapStateToProps,
  null,
)(AppointmentInfoBox);
