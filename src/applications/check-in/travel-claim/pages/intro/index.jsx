import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import TravelIntroDisplay from '../../../components/pages/TravelIntro/TravelIntroDisplay';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { useFormRouting } from '../../../hooks/useFormRouting';

const TravelIntro = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { jumpToPage } = useFormRouting(router);
  // @TODO logic need to figure out if we should go to multi-facility page or single
  const fileClaimClick = useCallback(
    e => {
      if (e?.key && e.key !== ' ') {
        return;
      }
      recordEvent({
        event: createAnalyticsSlug('file-travel-clicked', 'nav'),
      });
      e.preventDefault();
      jumpToPage('select-appointment');
    },
    [jumpToPage],
  );
  return (
    <TravelIntroDisplay
      header={t('file-a-travel-reimbursement-claim')}
      fileClaimClick={fileClaimClick}
    />
  );
};

TravelIntro.propTypes = {
  router: PropTypes.object,
};

export default TravelIntro;
