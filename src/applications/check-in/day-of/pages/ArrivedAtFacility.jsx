import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useFormRouting } from '../../hooks/useFormRouting';
import { recordAnswer } from '../../actions/universal';
import { createAnalyticsSlug } from '../../utils/analytics';
import { makeSelectCurrentContext } from '../../selectors';

import Wrapper from '../../components/layout/Wrapper';

import { APP_NAMES } from '../../utils/appConstants';

const ArrivedAtFacility = props => {
  const { router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextPage } = useFormRouting(router);

  const pageType = 'arrived-at-facility';
  const testID = 'arrived-page';

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { setECheckinStartedCalled } = useSelector(selectCurrentContext);

  const onClick = event => {
    const answer = event.target.attributes.value.value;
    recordEvent({
      event: createAnalyticsSlug(
        `${answer}-to-${pageType}${
          setECheckinStartedCalled ? '' : '-45MR'
        }-clicked`,
        'nav',
        APP_NAMES.CHECK_IN,
      ),
    });
  };

  const yesAction = event => {
    dispatch(recordAnswer({ [pageType]: 'yes' }));
    onClick(event);
    goToNextPage();
  };

  const noAction = event => {
    dispatch(recordAnswer({ [pageType]: 'no' }));
    onClick(event);
    goToNextPage();
  };

  return (
    <>
      <Wrapper
        pageTitle={t('have-you-arrived-at-your-va-health-facility')}
        eyebrow={t('check-in')}
        testID={testID}
      >
        <div data-testid="body-text" className="vads-u-margin-bottom--3">
          <p>{t('we-ask-this-question-because-staff-can-call-you')}</p>
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch mobile-lg:vads-u-flex-direction--row">
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
