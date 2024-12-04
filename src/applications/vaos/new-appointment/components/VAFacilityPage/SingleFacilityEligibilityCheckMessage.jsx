import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import getEligibilityMessage from './getEligibilityMessage';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  const title = 'You can’t schedule this appointment online';

  const { content } = getEligibilityMessage({
    eligibility,
    typeOfCare,
    facilityDetails: facility,
  });

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert status="warning" headline={title}>
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
