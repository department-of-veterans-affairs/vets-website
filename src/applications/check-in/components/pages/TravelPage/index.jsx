import React, { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { recordAnswer } from '../../../actions/universal';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useStorage } from '../../../hooks/useStorage';
import { createAnalyticsSlug } from '../../../utils/analytics';
import {
  makeSelectCurrentContext,
  makeSelectApp,
  makeSelectForm,
} from '../../../selectors';

import BackButton from '../../BackButton';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import TravelPayOMB from '../../TravelPayOMB';

const TravelPage = ({
  header,
  eyebrow,
  bodyText,
  helpText,
  additionalInfoItems,
  pageType,
  router,
  yesButtonText,
  yesFunction,
  noButtonText,
  noFunction,
  testID = 'travel-page',
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    goToNextPage,
    goToPreviousPage,
    jumpToPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { setECheckinStartedCalled } = useSelector(selectCurrentContext);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  const onClick = event => {
    const answer = event.target.attributes.value.value;
    // const nextPage = getNextPageFromRouter();
    recordEvent({
      event: createAnalyticsSlug(
        `${answer}-to-${pageType}${
          setECheckinStartedCalled || app !== APP_NAMES.CHECK_IN ? '' : '-45MR'
        }-clicked`,
        'nav',
        app,
      ),
    });
    dispatch(recordAnswer({ [pageType]: answer }));
    if (answer === 'no' && noFunction) {
      noFunction();
    } else if (answer === 'no') {
      jumpToPage(`complete/${data.activeAppointmentId}`);
    } else if (yesFunction) {
      yesFunction();
    } else {
      goToNextPage();
    }
  };
  const { getCheckinComplete } = useStorage(app);
  useLayoutEffect(() => {
    if (getCheckinComplete(window)) {
      jumpToPage(`complete/${data.activeAppointmentId}`);
    }
  });
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl={getPreviousPageFromRouter()}
      />
      <Wrapper
        pageTitle={header}
        classNames="travel-page"
        eyebrow={eyebrow}
        withBackButton
        testID={testID}
      >
        {bodyText && (
          <div data-testid="body-text" className="vads-u-margin-bottom--3">
            {bodyText}
          </div>
        )}
        {additionalInfoItems &&
          additionalInfoItems.map((infoData, index) => (
            <div className="vads-u-margin-bottom--2" key={index}>
              <va-additional-info uswds trigger={infoData.trigger}>
                {infoData.info}
              </va-additional-info>
            </div>
          ))}
        {helpText && (
          <div className="vads-u-margin-bottom--3 vads-u-margin-top--3">
            <va-alert
              show-icon
              status="info"
              data-testid="help-message"
              uswds
              slim
            >
              <div>{helpText}</div>
            </va-alert>
          </div>
        )}
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch mobile-lg:vads-u-flex-direction--row">
          <va-button
            uswds
            big
            onClick={onClick}
            text={yesButtonText || t('yes')}
            data-testid="yes-button"
            class="vads-u-margin-top--2"
            value="yes"
          />
          <va-button
            uswds
            big
            onClick={onClick}
            text={noButtonText || t('no')}
            data-testid="no-button"
            secondary
            class="vads-u-margin-top--2"
            value="no"
          />
        </div>
        <TravelPayOMB />
      </Wrapper>
    </>
  );
};
TravelPage.propTypes = {
  header: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  additionalInfoItems: PropTypes.arrayOf(PropTypes.object),
  bodyText: PropTypes.node,
  eyebrow: PropTypes.string,
  helpText: PropTypes.node,
  noButtonText: PropTypes.string,
  noFunction: PropTypes.func,
  testID: PropTypes.string,
  yesButtonText: PropTypes.string,
  yesFunction: PropTypes.func,
};
export default TravelPage;
