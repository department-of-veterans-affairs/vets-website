import React, { useMemo, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../../../utils/analytics';
import { useStorage } from '../../../hooks/useStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectApp, makeSelectCurrentContext } from '../../../selectors';

import DemographicItem from '../../DemographicItem';
import Wrapper from '../../layout/Wrapper';
import { toCamelCase } from '../../../utils/formatters';
import { URLS } from '../../../utils/navigation';
import { APP_NAMES } from '../../../utils/appConstants';

const ConfirmablePage = ({
  header,
  eyebrow = '',
  subtitle,
  helpText,
  additionalInfo,
  dataFields = [],
  data = {},
  yesAction,
  noAction,
  withBackButton = false,
  pageType,
  router,
}) => {
  const { t } = useTranslation();

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { setECheckinStartedCalled } = useSelector(selectCurrentContext);
  const { jumpToPage } = useFormRouting(router);
  const { getCheckinComplete } = useStorage(app === APP_NAMES.PRE_CHECK_IN);
  useLayoutEffect(() => {
    if (getCheckinComplete(window)) {
      jumpToPage(URLS.DETAILS);
    }
  });

  const onYesClick = () => {
    recordEvent({
      event: createAnalyticsSlug(
        `yes-to-${pageType}${setECheckinStartedCalled ? '-15MR' : ''}-clicked`,
        'nav',
      ),
    });
    yesAction();
  };

  const onNoClick = () => {
    recordEvent({
      event: createAnalyticsSlug(
        `no-to-${pageType}${pageType}${
          setECheckinStartedCalled ? '-15MR' : ''
        }-clicked`,
        'nav',
      ),
    });
    noAction();
  };
  return (
    <Wrapper
      pageTitle={header}
      classNames="confirmable-page"
      eyebrow={eyebrow}
      withBackButton={withBackButton}
    >
      {subtitle && (
        <p data-testid="subtitle" className="vads-u-font-family--serif">
          {subtitle}
        </p>
      )}
      {helpText}
      <div className="vads-u-margin-top--3">
        <ul
          data-testid="demographics-fields"
          className="check-in--definition-list"
        >
          {dataFields.map((field, i, { length }) => (
            <li key={field.key}>
              <div
                className="vads-u-font-weight--bold vads-u-border-top--1px vads-u-padding-top--2 vads-u-margin-top--2 vads-u-border-color--gray-light"
                aria-describedby={toCamelCase(field.title)}
              >
                {field.title}
              </div>
              <div
                id={toCamelCase(field.title)}
                className={
                  i + 1 === length
                    ? 'vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-bottom--2'
                    : ''
                }
              >
                {field.key in data && data[field.key] ? (
                  <DemographicItem demographic={data[field.key]} />
                ) : (
                  t('not-available')
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {additionalInfo}
      <>
        <button
          onClick={onYesClick}
          className="usa-button-primary usa-button-big"
          data-testid="yes-button"
          type="button"
        >
          {t('yes')}
        </button>
        <button
          onClick={onNoClick}
          className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
          data-testid="no-button"
          type="button"
        >
          {t('no')}
        </button>
      </>
    </Wrapper>
  );
};
ConfirmablePage.propTypes = {
  data: PropTypes.object.isRequired,
  dataFields: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  header: PropTypes.string.isRequired,
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  additionalInfo: PropTypes.object,
  eyebrow: PropTypes.string,
  helpText: PropTypes.object,
  pageType: PropTypes.string,
  router: PropTypes.object,
  subtitle: PropTypes.string,
  withBackButton: PropTypes.bool,
};
export default ConfirmablePage;
