import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { recordAnswer } from '../../../actions/universal';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useStorage } from '../../../hooks/useStorage';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { URLS } from '../../../utils/navigation';

import BackButton from '../../BackButton';
import Wrapper from '../../layout/Wrapper';

const TravelPage = ({
  header,
  eyebrow,
  bodyText,
  helpText,
  additionalInfo,
  pageType,
  router,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    goToNextPage,
    goToPreviousPage,
    jumpToPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const onClick = event => {
    const answer = event.target.value;
    recordEvent({
      event: createAnalyticsSlug(`${answer}-to-${pageType}-clicked`, 'nav'),
    });
    dispatch(recordAnswer({ [pageType]: answer }));
    if (answer === 'no') {
      jumpToPage(URLS.DETAILS);
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
        {additionalInfo && (
          <va-additional-info trigger="Travel reimbursement eligibility" uswds>
            <>{additionalInfo}</>
          </va-additional-info>
        )}
        {helpText && (
          <div className="vads-u-margin-bottom--3 vads-u-margin-top--3">
            <va-alert
              background-only
              show-icon
              status="info"
              data-testid="help-message"
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
            {t('yes')}
          </button>
          <button
            onClick={onClick}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
            type="button"
            value="no"
          >
            {t('no')}
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
  additionalInfo: PropTypes.node,
  bodyText: PropTypes.node,
  eyebrow: PropTypes.string,
  helpText: PropTypes.node,
};
export default TravelPage;
