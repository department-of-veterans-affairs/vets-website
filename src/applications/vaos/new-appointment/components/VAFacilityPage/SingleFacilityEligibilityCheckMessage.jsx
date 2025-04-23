import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import getEligibilityMessage from './getEligibilityMessage';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  const defaultTitle = 'You can’t schedule this appointment online';

  const { content, title, status = 'warning' } = getEligibilityMessage({
    eligibility,
    typeOfCare,
    facilityDetails: facility,
  });

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert status={status} headline={title || defaultTitle}>
        <p>{content}</p>
        {status === 'error' && (
          <p>
            If you need to schedule now, call your VA facility.
            <br />
            <NewTabAnchor href="/find-locations">
              Find a VA health facility
            </NewTabAnchor>
          </p>
        )}
      </InfoAlert>
    </div>
  );
}
SingleFacilityEligibilityCheckMessage.propTypes = {
  eligibility: PropTypes.object,
  facility: PropTypes.object,
  typeOfCare: PropTypes.object,
};
