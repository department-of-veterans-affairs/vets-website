import React from 'react';
import PropTypes from 'prop-types';
import { getTypeOfCare } from '../../../../redux/selectors';
import { FLOW_TYPES, FACILITY_TYPES } from '../../../../../utils/constants';
import { lowerCase } from '../../../../../utils/formatters';

export default function Description({ data, flowType }) {
  const typeOfCare = lowerCase(getTypeOfCare(data)?.name);
  const description =
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE
      ? 'community care'
      : typeOfCare;
  const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;
  const isVowel =
    (typeOfCare === 'amputation care' ||
      typeOfCare === 'audiology and speech' ||
      typeOfCare === 'optometry' ||
      typeOfCare === 'ophthalmology') &&
    description !== 'community care';
  return (
    <>
      {isDirectSchedule && (
        <>
          <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--3 vads-u-font-size--h3">
            You're scheduling {isVowel ? 'an' : 'a'} {description} appointment
          </h2>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
            Make sure the information is correct. Then confirm your appointment.
            If you need to update any details, click Edit to go back to the
            screen where you entered the information. After you update your
            information, you'll need to go through the tool again to schedule
            your appointment.
          </p>
        </>
      )}
    </>
  );
}
Description.propTypes = {
  data: PropTypes.object,
  flowType: PropTypes.string,
};
