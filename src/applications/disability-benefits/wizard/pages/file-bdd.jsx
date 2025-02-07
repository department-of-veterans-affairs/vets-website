import React from 'react';
import moment from 'moment';

import recordEvent from 'platform/monitoring/record-event';

import { BDD_INFO_URL } from 'applications/disability-benefits/all-claims/constants';

import { pageNames } from './pageList';
import { formStartButton } from '../wizard-utils';

const FileBDDClaim = ({ getPageStateFromPageName, setWizardStatus }) => {
  const stateBDD = getPageStateFromPageName('bdd');

  const label = 'File a BDD disability claim online';
  const linkText = 'Learn more about the BDD program';

  const dateDischarge = moment(stateBDD);
  const dateToday = moment();
  const differenceBetweenDatesInDays =
    dateDischarge.diff(dateToday, 'days') + 1;

  const daysRemainingToFileBDD = differenceBetweenDatesInDays - 90;
  const isLastDayToFileBDD = daysRemainingToFileBDD === 0;
  const dateOfLastBDDEligibility = moment()
    .add(daysRemainingToFileBDD, 'days')
    .format('MMMM D, YYYY');
  const daysLeft = `day${daysRemainingToFileBDD > 1 ? 's' : ''} left`;

  return (
    <div
      id={pageNames.fileBDD}
      className="usa-alert usa-alert-info background-color-only vads-u-padding--2 vads-u-margin-top--2"
    >
      <span className="sr-only">Info: </span>
      {daysRemainingToFileBDD < 0 ? null : (
        <>
          <p className="vads-u-margin-top--0">
            Based on your separation date, you can file a disability claim under
            the Benefits Delivery at Discharge (BDD) program.
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
              {isLastDayToFileBDD ? '' : `${dateOfLastBDDEligibility} at `}
              {' 11:59 p.m. CST'}
            </strong>{' '}
            to complete and submit the form.
          </p>
          {formStartButton({
            setWizardStatus,
            label,
            eventReason: 'wizard completed, starting BDD flow',
          })}
        </>
      )}
      <p id="learn_about_bdd" className="vads-u-margin-bottom--0">
        <a
          href={BDD_INFO_URL}
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label': linkText,
            });
          }}
        >
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
};
