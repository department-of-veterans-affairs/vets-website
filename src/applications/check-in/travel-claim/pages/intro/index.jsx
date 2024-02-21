import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import TravelIntroDisplay from '../../../components/pages/TravelIntro/TravelIntroDisplay';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { hasMultipleFacilities } from '../../../utils/appointment';
import { useFormRouting } from '../../../hooks/useFormRouting';
// Appointments will come from redux this is temp
import { singleFacility } from './testAppointments';

const TravelIntro = props => {
  const { router, appointments = singleFacility } = props;
  const { t } = useTranslation();

  const { jumpToPage } = useFormRouting(router);
  // @TODO logic need to figure out if we should go to multi-facility page or single

  const nextPage = hasMultipleFacilities(appointments)
    ? 'select-appointment'
    : 'travel-mileage';

  const fileClaimClick = useCallback(
    e => {
      if (e?.key && e.key !== ' ') {
        return;
      }
      recordEvent({
        event: createAnalyticsSlug('file-travel-clicked', 'nav'),
      });
      e.preventDefault();
      jumpToPage(nextPage);
    },
    [jumpToPage, nextPage],
  );
  return (
    <TravelIntroDisplay
      header={t('file-a-travel-reimbursement-claim')}
      fileClaimClick={fileClaimClick}
    />
  );
};

TravelIntro.propTypes = {
  // temp prop remove after data fetch in place
  appointments: PropTypes.array,
  router: PropTypes.object,
};

export default TravelIntro;
