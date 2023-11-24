import React from 'react';
import { useSelector } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { FETCH_STATUS } from '../../../utils/constants';
import getEligibilityMessage from './getEligibilityMessage';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
  typeOfCare,
}) {
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  const { title, content } = getEligibilityMessage({
    eligibility,
    facilityDetails,
    featureStatusImprovement,
    typeOfCare,
    includeFacilityContactInfo: true,
  });

  return (
    <VaModal
      id="eligibilityModal"
      status="warning"
      visible
      onCloseEvent={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      modalTitle={title}
      ariaLabel={title}
      data-testid="eligibilityModal"
      role="alertdialog"
    >
      <div aria-atomic="true" aria-live="assertive">
        {content}
      </div>
    </VaModal>
  );
}
EligibilityModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  eligibility: PropTypes.object,
  facilityDetails: PropTypes.object,
  typeOfCare: PropTypes.object,
};
