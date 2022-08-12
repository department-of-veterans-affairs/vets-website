import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';

import { BDD_INFO_URL, DISABILITY_526_V2_ROOT_URL } from '../../constants';

import pageNames from './pageNames';
import { getDiffInDays } from '../utils';

const content = {
  label: '',
  startText: 'File a BDD disability claim online',
  linkText: 'Learn more about the BDD program',
};

const FileBDDClaim = ({ data = {} }) => {
  const { radDate } = data;

  const differenceBetweenDatesInDays = getDiffInDays(radDate) + 1;

  const daysRemainingToFileBDD = differenceBetweenDatesInDays - 90;
  const isLastDayToFileBDD = daysRemainingToFileBDD === 0;
  const dateOfLastBDDEligibility = moment()
    .add(daysRemainingToFileBDD, 'days')
    .format('MMMM D, YYYY');
  const daysLeft = `day${daysRemainingToFileBDD > 1 ? 's' : ''} left`;

  return (
    <>
      <h1>You can use the Benefits Delivery at Discharge program</h1>
      <div
        id={pageNames.fileBDD}
        className="usa-alert usa-alert-info background-color-only vads-u-padding--2 vads-u-margin-top--2"
      >
        <span className="sr-only">Info: </span>
        {daysRemainingToFileBDD < 0 ? null : (
          <>
            <p className="vads-u-margin-top--0">
              Based on your separation date, you can file a disability claim
              under the Benefits Delivery at Discharge (BDD) program.{' '}
            </p>
            <p>
              {isLastDayToFileBDD ? (
                <>
                  This is your <b>last day</b>
                </>
              ) : (
                <>
                  You have <b>{daysRemainingToFileBDD}</b> {daysLeft}
                </>
              )}{' '}
              to file a BDD claim. You have until{' '}
              <strong>
                {isLastDayToFileBDD ? '' : `${dateOfLastBDDEligibility} at`}
                {' 11:59 p.m. CST'}
              </strong>{' '}
              to complete and submit the form.
            </p>
            {/* <a
              href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
              className="vads-c-action-link--green"
              onClick={() => {
                recordEvent({
                  event: 'howToWizard-hidden',
                  'reason-for-hidden-wizard':
                    'wizard completed, starting BDD flow',
                });
                recordEvent({
                  event: 'cta-button-click',
                  'button-type': 'primary',
                  'button-click-label': content.startText,
                });
              }}
              aria-describedby="learn_about_bdd"
            >
              {content.startText}
            </a> */}
          </>
        )}
        <p id="learn_about_bdd" className="vads-u-margin-bottom--0">
          <a
            href={BDD_INFO_URL}
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

FileBDDClaim.propTypes = {
  data: PropTypes.shape({}),
};

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
  back: pageNames.rad,
  next: `${DISABILITY_526_V2_ROOT_URL}/introduction`,
};
