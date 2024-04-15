import React from 'react';
import { addDays } from 'date-fns';
import { formatDate } from '../../../combined/utils/helpers';

const TriangleIcon = () => (
  <>
    <i aria-hidden="true" className="fas fa-exclamation-triangle icon-right" />
    <span className="sr-only">important</span>
  </>
);
const CircleIcon = () => (
  <>
    <i aria-hidden="true" className="fas fa-info-circle icon-right" />
    <span className="sr-only">informational</span>
  </>
);

export const debtSummaryText = (diaryCode, dateOfLetter, balance) => {
  const endDate = (date, days) => formatDate(addDays(new Date(date), days));

  switch (diaryCode) {
    case '71':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Contact us to verify your military status
          </p>
        </div>
      );
    case '655':
    case '817':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Submit a Financial Status Report so that we can make a decision on
            your request
          </p>
        </div>
      );
    case '212':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Contact us to update your address
          </p>
        </div>
      );
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            We’ve paused collection on this debt as you requested
          </p>
        </div>
      );
    case '439': // TODO: Date logic TBD
    case '449':
    case '459': // This one is 30 days
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} balance now or request help by{' '}
            {dateOfLetter && endDate(dateOfLetter, 30)}
          </p>
        </div>
      );
    case '109':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} balance now or request help by{' '}
            {dateOfLetter && endDate(dateOfLetter, 30)}
            to avoid more interest charges
          </p>
        </div>
      );
    case '100': // TODO: Date Not Listed
    case '102':
    case '130':
    case '140':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} balance now or request help by{' '}
            {dateOfLetter && endDate(dateOfLetter, 30)}.
          </p>
        </div>
      );
    case '117':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} past due balance in full or request help before{' '}
            {dateOfLetter && endDate(dateOfLetter, 60)}
          </p>
        </div>
      );
    case '123':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} past due balance now or request help by{' '}
            {dateOfLetter && endDate(dateOfLetter, 60)}
          </p>
        </div>
      );
    case '680':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your {balance} balance now or request help
          </p>
        </div>
      );
    case '681':
    case '682':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            The U.S. Department of the Treasury is offsetting your federal
            payments until your debt is paid
          </p>
        </div>
      );
    // case '18': Passthrough status for a CRA referral being made
    case '600':
    case '601':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments until your balance is paid
          </p>
        </div>
      );
    case '430':
    case '431':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            We’re offsetting your education benefits each month until your debt
            is paid
          </p>
        </div>
      );
    case '101':
    case '450':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            We’re offsetting your benefit payments each month until your debt is
            paid
          </p>
        </div>
      );
    case '603': // TODO: Date Not Listed
    case '613':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Make a payment on your {balance} balance or request help by{' '}
            {dateOfLetter && endDate(dateOfLetter, 30)}
          </p>
        </div>
      );
    // case '122': TODO: Passthrough status for a CRA referral being made
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Contact the U.S. Department of the Treasury to pay this debt
          </p>
        </div>
      );
    case '811':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments while we review your compromise
            offer
          </p>
        </div>
      );
    case '815': // TODO: Date Not Listed
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <TriangleIcon />
          <p className="vads-u-margin-y--0">
            Pay your one time payment as part of your compromise agreement by{' '}
            {dateOfLetter && endDate(dateOfLetter, 30)}
          </p>
        </div>
      );
    case '816':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            We’re processing your compromise offer payment
          </p>
        </div>
      );
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments while we review your waiver request
          </p>
        </div>
      );
    // case '818', '819', '830', '842' Omitted
    case '822':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments while we review your dispute
          </p>
        </div>
      );
    case '825':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments while we review your request for a
            hearing
          </p>
        </div>
      );
    case '821':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">
            Continue making monthly payments while we review your Notice of
            Disagreement
          </p>
        </div>
      );
    case '002':
    case '005':
    case '032':
    case '609':
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '627':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">We’re updating your account</p>
        </div>
      );
    case '481':
    case '482':
    case '483':
    case '484':
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">We’re reviewing your account</p>
        </div>
      );
    case '425': // ok - defined in spreadsheet
    case '081': // TODO: No Definition in mockup
    case '500':
    case '510':
    case '503':
    default:
      return (
        <div className="vads-u-display--flex vads-u-align-items--baseline vads-u-margin-bottom--1p5">
          <CircleIcon />
          <p className="vads-u-margin-y--0">We’re updating your account.</p>
        </div>
      );
  }
};
