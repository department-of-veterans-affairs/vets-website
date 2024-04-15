import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { getUniqueFacilies } from '../../../utils/appointment';
import { formatList } from '../../../utils/formatters';

const TravelClaimSuccessAlert = props => {
  const { claims } = props;
  const facilities = getUniqueFacilies(claims);
  const { t } = useTranslation();

  let appointmentCount = claims.length;

  if (claims.length === 1) {
    appointmentCount = claims[0].appointmentCount;
  }
  return (
    <div className="vads-u-margin-y--4">
      <va-alert
        show-icon
        data-testid="travel-pay-message"
        status="success"
        uswds
      >
        <h2 slot="headline">
          {t('claim-submitted', { count: facilities.length })}
        </h2>
        <p
          className="vads-u-margin-top--0"
          data-testid={`travel-pay-${
            facilities.length > 1 ? 'multi' : 'single'
          }-claim-${
            appointmentCount > 1 ? 'multi' : 'single'
          }-appointment-submitted`}
        >
          {`${t('this-claim-is-for-your-appointment', {
            date: format(new Date(), 'MMMM dd, yyyy'),
            claims: facilities.length,
            appointments: appointmentCount,
          })} ${formatList([...facilities], t('and'))} ${t(
            'well-send-you-a-text-to-let-you-know',
            {
              count: facilities.length,
            },
          )}`}
        </p>
        <p>{t('you-dont-need-to-do-anything-else')}</p>
      </va-alert>
    </div>
  );
};

TravelClaimSuccessAlert.propTypes = {
  claims: PropTypes.array.isRequired,
};

export default TravelClaimSuccessAlert;
