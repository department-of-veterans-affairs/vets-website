import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../../actions/universal';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { URLS } from '../../../utils/navigation';

import BackButton from '../../BackButton';
import Wrapper from '../../layout/Wrapper';

const TravelPage = ({ header, bodyText, helpText, pageType, router }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);
  const onClick = event => {
    const answer = event.target.innerText.toLowerCase();
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
  return (
    <>
      <BackButton router={router} action={goToPreviousPage} />
      <Wrapper pageTitle={header} classNames="travel-page" withBackButton>
        {bodyText && (
          <div data-testid="body-text" className="vads-u-font-family--serif">
            {bodyText}
          </div>
        )}
        <>
          <button
            onClick={onClick}
            className="usa-button-primary usa-button-big"
            data-testid="yes-button"
            type="button"
          >
            {t('yes')}
          </button>
          <button
            onClick={onClick}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
            type="button"
          >
            {t('no')}
          </button>
        </>
        {helpText && (
          <div className="vads-u-margin-top--3">
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
      </Wrapper>
    </>
  );
};
TravelPage.propTypes = {
  header: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  bodyText: PropTypes.node,
  helpText: PropTypes.node,
  pageType: PropTypes.string.isRequired,
};
export default TravelPage;
