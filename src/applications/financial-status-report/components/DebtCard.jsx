import React from 'react';
import head from 'lodash/head';
import moment from 'moment';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import classnames from 'classnames';

const DebtCard = ({ debt, key }) => {
  const mostRecentHistory = head(debt.debtHistory);
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
      <h3 className="vads-u-font-size--h4 vads-u-margin--0">
        {debtCardHeading}
      </h3>
      {mostRecentHistory && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Updated on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
      )}
      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Amount owed: </strong>
        {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
      </p>
      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Status: </strong>
        {debt.diaryCodeDescription}
      </p>

      <div className="vads-u-margin-top--2">
        <input
          id={key}
          type="checkbox"
          className=" vads-u-width--auto"
          checked={false}
          onChange={() => null}
        />
        <label
          className={classnames({
            'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary vads-u-margin-bottom--0 vads-u-width--auto vads-u-text-align--left vads-u-padding-x--2': true,
            'vads-u-color--white': false,
            'vads-u-background-color--white vads-u-color--primary': true,
          })}
          htmlFor={key}
        >
          Request assistance for this debt
        </label>
      </div>
    </div>
  );
};

DebtCard.propTypes = {
  debt: PropTypes.shape({
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    originalAr: PropTypes.number,
  }),
};

DebtCard.defaultProps = {
  debt: {
    currentAr: 0,
    debtHistory: [{ date: '' }],
    deductionCode: '',
    originalAr: 0,
  },
};

export default DebtCard;
