import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import HealthCareCard from './HealthCareCard';
import { recordDashboardClick } from 'applications/personalization/dashboard/helpers';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';

export const Prescriptions = ({ authenticatedWithSSOe, prescriptions }) => {
  let filteredPrescriptions;
  let latestPrescription;
  let refillsInProgress;

  if (prescriptions?.length) {
    const thirtyDaysAgo = moment()
      .endOf('day')
      .subtract(30, 'days');
    const statuses = new Set(['refillinprocess', 'submitted']);

    filteredPrescriptions = prescriptions
      .filter(p => statuses.has(p.attributes?.refillStatus))
      .filter(
        p =>
          moment(p.attributes?.refillSubmitDate).isAfter(thirtyDaysAgo) ||
          moment(p.attributes?.refillDate).isAfter(thirtyDaysAgo),
      );

    latestPrescription = filteredPrescriptions[0];
    refillsInProgress = filteredPrescriptions?.length;
  }

  const cardDetails = {
    sectionTitle: 'Prescriptions',
    cardTitle: 'Prescription refills',
    line1: latestPrescription?.attributes?.prescriptionName,
    line2: `Status: Submitted on ${moment(
      latestPrescription?.attributes?.refillSubmitDate,
    ).format('dddd, MMMM D, YYYY')}`,
    line3: '',
    ctaIcon: 'prescription-bottle',
    ctaText: `${refillsInProgress} prescription refill${
      refillsInProgress > 1 ? 's' : ''
    }`,
    ctaHref: mhvUrl(
      authenticatedWithSSOe,
      'web/myhealthevet/refill-prescriptions',
    ),
    ctaAriaLabel: 'View prescription refills',
    ctaOnClick: recordDashboardClick('view-all-prescriptions'),
  };

  if (!refillsInProgress) {
    cardDetails.cardTitle = '';
    cardDetails.line1 = 'You have no prescription refills in progress';
    cardDetails.ctaText = 'Go to prescription updates';
  }

  // User has prescriptions, but none are 'refillinprocess' or 'submitted'
  // This is passed as the noActiveData prop to update the card's layout
  return (
    <HealthCareCard
      type="prescriptions"
      cardProperties={cardDetails}
      noActiveData={!refillsInProgress}
    />
  );
};

Prescriptions.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  prescriptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        dispensedDate: PropTypes.string,
        expirationDate: PropTypes.string.isRequired,
        facilityName: PropTypes.string.isRequired,
        isRefillable: PropTypes.bool.isRequired,
        isTrackable: PropTypes.bool.isRequired,
        orderedDate: PropTypes.string.isRequired,
        prescriptionId: PropTypes.number.isRequired,
        prescriptionName: PropTypes.string.isRequired,
        prescriptionNumber: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        refillDate: PropTypes.string.isRequired,
        refillRemaining: PropTypes.number.isRequired,
        refillStatus: PropTypes.string.isRequired,
        refillSubmitDate: PropTypes.string,
        stationNumber: PropTypes.string.isRequired,
      }),
      id: PropTypes.string.isRequired,
    }),
  ),
};

export default Prescriptions;
