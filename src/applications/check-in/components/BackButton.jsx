import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';
import { URLS } from '../utils/navigation';

const BackButton = props => {
  const { action, prevUrl, router, text = null } = props;
  const {
    getCurrentPageFromRouter,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const { t } = useTranslation();

  const currentPage = getCurrentPageFromRouter();
  const previousPage = getPreviousPageFromRouter();

  const handleClick = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: createAnalyticsSlug('back-button-clicked', 'nav'),
        fromPage: currentPage,
      });
      action();
    },
    [currentPage, action],
  );

  if (previousPage && previousPage === URLS.VERIFY) {
    return '';
  }
  return (
    <>
      <nav
        aria-label={t('breadcrumb')}
        className="row check-in-back-button columns"
      >
        <Link onClick={handleClick} to={prevUrl} data-testid="back-button">
          <i
            aria-hidden="true"
            className="fas fa-angle-left vads-u-margin-right--0p25"
          />
          {text || t('back-to-last-screen')}
        </Link>
      </nav>
    </>
  );
};

BackButton.propTypes = {
  action: PropTypes.func,
  prevUrl: PropTypes.string,
  router: PropTypes.object,
  text: PropTypes.string,
};

export default BackButton;
