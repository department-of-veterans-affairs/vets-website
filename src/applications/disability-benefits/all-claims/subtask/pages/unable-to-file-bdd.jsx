import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { BDD_INFO_URL } from 'applications/disability-benefits/all-claims/constants';

import { daysFromToday } from '../../utils/dates/formatting';
import { parseDate } from '../../utils/dates';

import { getDiffInDays } from '../utils';

import pageNames from './pageNames';

const content = {
  linkText:
    'Learn more about why you’re not eligible for disability benefits right now',
};

const getToday = () => parseDate(daysFromToday(0));

const UnableToFileBDDPage = ({ data = {} }) => {
  const { radDate } = data;

  const differenceBetweenDatesInDays = getDiffInDays(radDate) - 179;
  const dateEligible = getToday()
    .add(differenceBetweenDatesInDays, 'days')
    .formatDate();

  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'Unable to file for BDD',
  });

  return (
    <>
      <h1>You can’t file for disability compensation benefits yet</h1>
      <div
        id={pageNames.unableToFileBDD}
        className="usa-alert usa-alert-info background-color-only vads-u-padding--2 vads-u-margin-top--2"
      >
        <div id="not-eligbile-details" aria-live="polite">
          <span className="sr-only">Info: </span>
          <p className="vads-u-margin-top--0">
            Based on your separation date, you’re not eligible to file for
            disability benefits right now.
          </p>
          {differenceBetweenDatesInDays > 0 && (
            <p>
              You’ll be eligible to file a disability claim under the Benefits
              Delivery at Discharge (BDD) program in{' '}
              <strong>{differenceBetweenDatesInDays}</strong> days (
              <strong>{dateEligible}</strong>
              ). This program allows you to apply for disability benefits before
              you leave the military.
            </p>
          )}
        </div>
        <p>
          <a
            href={BDD_INFO_URL}
            aria-describedby="not-eligbile-details"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label': content.linkText,
              });
            }}
          >
            {content.linkText}
          </a>
        </p>
      </div>
    </>
  );
};

UnableToFileBDDPage.propTypes = {
  data: PropTypes.shape({}),
};

export default {
  name: pageNames.unableToFileBDD,
  component: UnableToFileBDDPage,
  back: pageNames.rad,
  next: null,
};
