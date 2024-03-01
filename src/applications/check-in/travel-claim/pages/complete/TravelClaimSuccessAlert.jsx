import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getUniqueFacilies } from '../../../utils/appointment';
import { formatList } from '../../../utils/formatters';

const TravelClaimSuccessAlert = props => {
  // @TODO refactor this once we have worked out where to derive facilities and times for claims from
  const { appointments } = props;
  const facilities = getUniqueFacilies(appointments);

  const { t } = useTranslation();

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
          }-claim-submitted`}
        >
          {`${t('this-claim-is-for-your-appointment', {
            date: new Date('2024-02-23T11:12:11'),
            count: facilities.length,
          })} ${formatList(facilities, t('and'))} ${t(
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
  appointments: PropTypes.array,
};

export default TravelClaimSuccessAlert;
