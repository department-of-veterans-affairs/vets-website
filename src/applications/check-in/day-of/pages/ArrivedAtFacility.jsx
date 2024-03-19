import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useFormRouting } from '../../hooks/useFormRouting';
import { recordAnswer } from '../../actions/universal';
import { createAnalyticsSlug } from '../../utils/analytics';

import ArrivedPage from '../../components/pages/ArrivedPage';

const ArrivedAtFacility = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextPage, getCurrentPageFromRouter } = useFormRouting(router);
  const currentPage = getCurrentPageFromRouter();

  const bodyText = (
    <>
      <p>{t('we-ask-this-question-because-staff-can-call-you')}</p>
    </>
  );

  const yesAction = () => {
    recordEvent({
      event: createAnalyticsSlug('check-in-arrived-at-facility-yes'),
      fromPage: currentPage,
    });
    dispatch(recordAnswer({ 'arrived-at-facility': 'yes' }));
    goToNextPage();
  };

  const noAction = () => {
    recordEvent({
      event: createAnalyticsSlug('check-in-arrived-at-facility-no'),
      fromPage: currentPage,
    });
    dispatch(recordAnswer({ 'arrived-at-facility': 'no' }));
    goToNextPage();
  };

  return (
    <ArrivedPage
      header={t('have-you-arrived-at-your-va-health-facility')}
      eyebrow={t('check-in')}
      bodyText={bodyText}
      yesAction={yesAction}
      noAction={noAction}
      pageType="arrived-at-facility"
      router={router}
    />
  );
};

ArrivedAtFacility.propTypes = {
  router: PropTypes.object,
};

export default ArrivedAtFacility;
