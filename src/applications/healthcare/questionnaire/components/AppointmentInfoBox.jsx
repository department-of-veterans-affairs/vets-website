import moment from 'moment';
import { genderLabels } from 'platform/static-data/labels';
import React from 'react';
import { connect } from 'react-redux';
import AddressView from './AddressView';
import PhoneNumberView from './PhoneNumberView';

const AppointmentInfoBox = props => {
  const { userFullName, dateOfBirth, gender, addresses, phoneNumbers } = props;
  const fullName = [userFullName.first, userFullName.middle, userFullName.last]
    .join(' ')
    .trim();
  const { residential, mailing } = addresses;

  return (
    <div>
      <p>This is formation is for you appointment at.....</p>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--1">
          <p
            className="vads-u-margin--1px vads-u-font-weight--bold"
            aria-label="Veterans Full Name"
            data-test-id="fullName"
          >
            {fullName}
          </p>
          <p className="vads-u-margin--1px">
            Date of birth:{' '}
            <time
              dateTime={dateOfBirth}
              aria-label="Veteran's date of birth"
              className="vads-u-font-weight--bold"
              data-test-id="dateOfBirth"
            >
              {moment(dateOfBirth).format('MMMM DD, YYYY')}
            </time>
          </p>
          {gender && (
            <>
              <p className="vads-u-margin--1px">
                Gender:
                <span
                  className=" vads-u-font-weight--bold"
                  data-test-id="gender"
                >
                  {gender ? genderLabels[gender] : 'UNKNOWN'}
                </span>
              </p>
            </>
          )}
          {mailing && (
            <>
              <p>
                <span className=" vads-u-font-weight--bold">
                  Mailing Address:{' '}
                </span>
                <span data-test-id="mailingAddress">
                  <AddressView address={mailing} />
                </span>
              </p>
            </>
          )}
          {residential && (
            <>
              <p>
                <span className=" vads-u-font-weight--bold">
                  Residential Address:{' '}
                </span>
                <span data-test-id="residentialAddress">
                  <AddressView address={residential} />
                </span>
              </p>
            </>
          )}
          {phoneNumbers.filter(num => num.data).map((number, index) => {
            return <PhoneNumberView key={index} number={number} />;
          })}
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
  addresses: {
    residential: state.user?.profile?.vet360?.residentialAddress,
    mailing: state.user?.profile?.vet360?.mailingAddress,
  },
  phoneNumbers: [
    { label: 'Home', data: state.user?.profile?.vet360?.homePhone },
    { label: 'Mobile', data: state.user?.profile?.vet360?.mobilePhone },
    { label: 'Work', data: state.user?.profile?.vet360?.workPhone },
    { label: 'Temporary', data: state.user?.profile?.vet360?.temporaryPhone },
  ],
});

export default connect(
  mapStateToProps,
  null,
)(AppointmentInfoBox);
