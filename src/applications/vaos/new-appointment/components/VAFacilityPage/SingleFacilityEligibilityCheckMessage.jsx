import PropTypes from 'prop-types';
import React from 'react';
import InfoAlert from '../../../components/InfoAlert';
import { lowerCase } from '../../../utils/formatters';
import getEligibilityMessage from './getEligibilityMessage';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  const title = 'You can’t schedule this appointment online';

  const { content, title: newTitle } = getEligibilityMessage({
    eligibility,
    typeOfCare,
    facilityDetails: facility,
  });

  return (
    <>
      <p>
        We found one VA facility for your {lowerCase(typeOfCare?.name)}{' '}
        appointment
      </p>
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert status="warning" headline={newTitle || title}>
          {content}
        </InfoAlert>
      </div>
    </>
  );
}
SingleFacilityEligibilityCheckMessage.propTypes = {
  eligibility: PropTypes.object,
  facility: PropTypes.object,
  typeOfCare: PropTypes.object,
};
