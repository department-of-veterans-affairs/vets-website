import React from 'react';
import last from 'lodash/last';
import moment from 'moment';
import { deductionCodes } from '../const';
import { connect } from 'react-redux';

const DebtLetterCard = props => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const { debt } = props;
  const mostRecentHistory = last(debt.debtHistory);
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2p5">
      <h4 className="vads-u-margin--0 vads-u-font-size--h3">
        {deductionCodes[debt.deductionCode]} debt{' '}
      </h4>
      <p>Received on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}</p>
      <p className="vads-u-margin-bottom--0 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--sans">
        Amount owed:
      </p>
      <p className="vads-u-margin-top--0 vads-u-font-size--md vads-u-font-family--sans">
        {formatter.format(parseFloat(debt.currentAr))}
      </p>
    </div>
  );
};

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters.selectedDebt,
});

export default connect(mapStateToProps)(DebtLetterCard);
