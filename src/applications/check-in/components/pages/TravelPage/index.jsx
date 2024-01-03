import React, { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { recordAnswer } from '../../../actions/universal';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useStorage } from '../../../hooks/useStorage';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { makeSelectCurrentContext } from '../../../selectors';
import { URLS } from '../../../utils/navigation';

import BackButton from '../../BackButton';
import Wrapper from '../../layout/Wrapper';

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

  const onClick = event => {
    const answer = event.target.value;
    recordEvent({
      event: createAnalyticsSlug(
        `${answer}-to-${pageType}${
          setECheckinStartedCalled ? '' : '-45MR'
        }-clicked`,
        'nav',
      ),
    });
    dispatch(recordAnswer({ [pageType]: answer }));
    if (answer === 'no' && noFunction) {
      noFunction();
    } else if (answer === 'no') {
      jumpToPage(URLS.DETAILS);
    } else if (yesFunction) {
      yesFunction();
    } else {
      goToNextPage();
    }
  };
  const { getCheckinComplete } = useStorage(false);
  useLayoutEffect(() => {
    if (getCheckinComplete(window)) {
      jumpToPage(URLS.DETAILS);
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
      >
        {bodyText && (
          <div
            data-testid="body-text"
            className="vads-u-font-family--serif vads-u-margin-bottom--3"
          >
            {bodyText}
          </div>
        )}
        {additionalInfoItems &&
          additionalInfoItems.map((infoData, index) => (
            <React.Fragment key={index}>
              <va-additional-info uswds trigger={infoData.trigger}>
                {infoData.info}
              </va-additional-info>
            </React.Fragment>
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
        <>
          <button
            onClick={onClick}
            className="usa-button-primary usa-button-big"
            data-testid="yes-button"
            type="button"
            value="yes"
          >
            {yesButtonText || t('yes')}
          </button>
          <button
            onClick={onClick}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
            type="button"
            value="no"
          >
            {noButtonText || t('no')}
          </button>
        </>
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
  yesButtonText: PropTypes.string,
  yesFunction: PropTypes.func,
};
export default TravelPage;
