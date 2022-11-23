import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../../../utils/analytics';

import DemographicItem from '../../DemographicItem';
import Wrapper from '../../layout/Wrapper';

const ConfirmablePage = ({
  header,
  subtitle,
  dataFields = [],
  data = {},
  yesAction = () => {},
  noAction = () => {},
  withBackButton = false,
  pageType,
}) => {
  const { t } = useTranslation();

  const onYesClick = () => {
    recordEvent({
      event: createAnalyticsSlug(`yes-to-${pageType}-clicked`, 'nav'),
    });
    yesAction();
  };

  const onNoClick = () => {
    recordEvent({
      event: createAnalyticsSlug(`no-to-${pageType}-clicked`, 'nav'),
    });
    noAction();
  };
  return (
    <Wrapper
      pageTitle={header}
      classNames="confirmable-page"
      withBackButton={withBackButton}
    >
      {subtitle && (
        <p data-testid="subtitle" className="vads-u-font-family--serif">
          {subtitle}
        </p>
      )}
      <div className="vads-u-margin-top--3">
        <ul
          data-testid="demographics-fields"
          className="check-in--definition-list"
        >
          {dataFields.map((field, i, { length }) => (
            <li key={field.key}>
              <div
                className="vads-u-font-weight--bold vads-u-border-top--1px vads-u-padding-top--2 vads-u-margin-top--2 vads-u-border-color--gray-light"
                aria-describedby={field.title}
              >
                {field.title}
              </div>
              <div
                id={field.title}
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
  pageType: PropTypes.string,
  subtitle: PropTypes.string,
  withBackButton: PropTypes.bool,
};
export default ConfirmablePage;
