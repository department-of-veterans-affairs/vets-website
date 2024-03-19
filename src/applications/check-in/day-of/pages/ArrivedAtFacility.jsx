import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useFormRouting } from '../../hooks/useFormRouting';
import { recordAnswer } from '../../actions/universal';
import { createAnalyticsSlug } from '../../utils/analytics';
import { makeSelectCurrentContext, makeSelectApp } from '../../selectors';

import Wrapper from '../../components/layout/Wrapper';

import { APP_NAMES } from '../../utils/appConstants';

const ArrivedAtFacility = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextPage, getCurrentPageFromRouter } = useFormRouting(router);
  const currentPage = getCurrentPageFromRouter();

  const pageType = 'arrived-at-facility';
  const testID = 'arrived-page';
  const bodyText = (
    <>
      <p>{t('we-ask-this-question-because-staff-can-call-you')}</p>
    </>
  );

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { setECheckinStartedCalled } = useSelector(selectCurrentContext);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const onClick = event => {
    const answer = event.target.attributes.value.value;
    recordEvent({
      event: createAnalyticsSlug(
        `${answer}-to-${pageType}${
          setECheckinStartedCalled || app !== APP_NAMES.CHECK_IN ? '' : '-45MR'
        }-clicked`,
        'nav',
        app,
      ),
    });
  };

  const yesAction = event => {
    recordEvent({
      event: createAnalyticsSlug('arrived-at-facility-yes'),
      fromPage: currentPage,
    });
    dispatch(recordAnswer({ [pageType]: 'yes' }));
    onClick(event);
    goToNextPage();
  };

  const noAction = event => {
    recordEvent({
      event: createAnalyticsSlug('arrived-at-facility-no'),
      fromPage: currentPage,
    });
    dispatch(recordAnswer({ [pageType]: 'no' }));
    onClick(event);
    goToNextPage();
  };

  return (
    <>
      <Wrapper
        pageTitle={t('have-you-arrived-at-your-va-health-facility')}
        testID={testID}
      >
        {bodyText && (
          <div data-testid="body-text" className="vads-u-margin-bottom--3">
            {bodyText}
          </div>
        )}
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
          <va-button
            uswds
            big
            onClick={yesAction}
            text={t('yes')}
            data-testid="yes-button"
            class="vads-u-margin-top--2"
            value="yes"
          />
          <va-button
            uswds
            big
            onClick={noAction}
            text={t('no')}
            data-testid="no-button"
            secondary
            class="vads-u-margin-top--2"
            value="no"
          />
        </div>
      </Wrapper>
    </>
  );
};

ArrivedAtFacility.propTypes = {
  router: PropTypes.object,
};

export default ArrivedAtFacility;
