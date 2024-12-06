import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import getEligibilityMessage from './getEligibilityMessage';
import { lowerCase } from '../../../utils/formatters';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  const defaultTitle = 'You can’t schedule this appointment online';

  const { content, title } = getEligibilityMessage({
    eligibility,
    typeOfCare,
    facilityDetails: facility,
  });

  return (
    <div aria-atomic="true" aria-live="assertive">
      <p>
        We found one VA facility for you {lowerCase(typeOfCare.name)}{' '}
        appointment
      </p>
      <InfoAlert status="warning" headline={title || defaultTitle}>
        {content}
      </InfoAlert>
    </div>
  );
}
SingleFacilityEligibilityCheckMessage.propTypes = {
  eligibility: PropTypes.object,
  facility: PropTypes.object,
  typeOfCare: PropTypes.object,
};
