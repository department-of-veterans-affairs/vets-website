import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectProfile, selectVAPContactInfo } from 'platform/user/selectors';

import AddressView from './AddressView';
import PhoneNumberView from './PhoneNumberView';
import AppointmentDisplay from './AppointmentDisplay';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';

const AppointmentInfoBox = props => {
  const {
    userFullName,
    dateOfBirth,
    gender,
    addresses,
    phoneNumbers,
    appointment,
    setFormData,
    saveForm,
    form,
  } = props;
  const [phones] = useState(phoneNumbers);
  const [allAddresses] = useState(addresses);
  const fullName = useMemo(
    () => {
      return [userFullName.first, userFullName.middle, userFullName.last]
        .filter(f => f)
        .map(name => name[0].toUpperCase() + name.substr(1).toLowerCase())
        .join(' ')
        .trim();
    },
    [userFullName.first, userFullName.middle, userFullName.last],
  );

  const { residential, mailing } = allAddresses;
  const { formId, version, data } = form;
  const veteranInfo = {
    gender,
    dateOfBirth,
    fullName,
    phones,
    addresses: allAddresses,
  };
  useEffect(
    () => {
      // only updates teh SIP data if there is no vet information.
      if (Object.keys(data.veteranInfo).length === 0) {
        setFormData({ veteranInfo });
        const returnUrl = '/demographics';
        saveForm(formId, { ...data, veteranInfo }, version, returnUrl);
      }
    },
    [setFormData, saveForm, veteranInfo, formId, version, data],
  );

  return (
    <div>
      <AppointmentDisplay appointment={appointment} />
      <p>
        Below is the personal and contact information we have on file for you.
      </p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--2">
          <p
            className="vads-u-margin--1px vads-u-font-weight--bold"
            aria-label="Veterans Full Name"
            data-testid="fullName"
          >
            {fullName}
          </p>
          <p className="vads-u-margin--1px">
            Date of birth:{' '}
            <time
              dateTime={dateOfBirth}
              aria-label="Veteran's date of birth"
              data-testid="dateOfBirth"
            >
              {moment(dateOfBirth).format('MMMM DD, YYYY')}
            </time>
          </p>
          {gender && (
            <>
              <p className="vads-u-margin--1px">
                Gender:{' '}
                <span data-testid="gender">
                  {genderLabels[gender] ? genderLabels[gender] : 'UNKNOWN'}
                </span>
              </p>
            </>
          )}
          {mailing && (
            <>
              <p>
                <span>Mailing address: </span>
                <span data-testid="mailingAddress">
                  <AddressView address={mailing} />
                </span>
              </p>
            </>
          )}
          {residential && (
            <>
              <p>
                <span>Home address: </span>
                <span data-testid="residentialAddress">
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
        Note: If you need to update your personal information, please call
        Veterans Benefits Assistance at{' '}
        <a href="tel:800-827-1000">800-827-1000</a>, Monday through Friday, 8:00
        a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const vapContactInfo = selectVAPContactInfo(state);
  return {
    form: state.form,
    userFullName: profile.userFullName,
    dateOfBirth: profile.dob,
    gender: profile.gender,
    addresses: {
      residential: vapContactInfo?.residentialAddress,
      mailing: vapContactInfo?.mailingAddress,
    },
    phoneNumbers: [
      { label: 'Home', data: vapContactInfo?.homePhone },
      { label: 'Mobile', data: vapContactInfo?.mobilePhone },
      { label: 'Work', data: vapContactInfo?.workPhone },
      { label: 'Temporary', data: vapContactInfo?.temporaryPhone },
    ],
    appointment: state.questionnaireData?.context?.appointment,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  saveForm: autoSaveForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AppointmentInfoBox),
);
