import React from 'react';
import { getTypeOfCare } from '../../utils/selectors';
import { FLOW_TYPES, FACILITY_TYPES } from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';

export default function Description({ data, flowType }) {
  const typeOfCare = lowerCase(getTypeOfCare(data)?.name);
  const description =
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE
      ? 'Community Care'
      : typeOfCare;
  const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

  return (
    <>
      <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--3 vads-u-font-size--h3">
        You’re {isDirectSchedule ? 'scheduling' : 'requesting'} a {description}{' '}
        appointment
      </h2>
      {isDirectSchedule && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
          Please review the information before confirming your appointment. If
          you need to update any details, click Edit to go back to the screen
          where you entered the information. After you update your information,
          you’ll need to go through the tool again to schedule your appointment.
        </p>
      )}
      {!isDirectSchedule && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
          Please review the information before submitting your request. If you
          need to update any details, click Edit to go back to the screen where
          you entered the information. After you update your information, you’ll
          need to go through the tool again to request your appointment.
        </p>
      )}
    </>
  );
}
