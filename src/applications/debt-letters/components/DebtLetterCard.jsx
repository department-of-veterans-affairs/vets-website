import React from 'react';
import head from 'lodash/head';
import moment from 'moment';
import { Link } from 'react-router';
import { deductionCodes } from '../const/deduction-codes';
import { bindActionCreators } from 'redux';
import { setActiveDebt } from '../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { renderAdditionalInfo } from '../const/diary-codes';

const DebtLetterCard = props => {
  const { debt } = props;
  const mostRecentHistory = head(debt.debtHistory);
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const additionalInfo = renderAdditionalInfo(
    debt.diaryCode,
    mostRecentHistory.date,
    debt.benefitType,
  );

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
      <h3 className="vads-u-margin--0">{debtCardHeading}</h3>
      {mostRecentHistory && (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          Updated on {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
      )}
      <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
        <strong>Amount owed: </strong>
        {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
      </p>
      {additionalInfo.status && (
        <div
          className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans"
          data-testid="diary-codes-status"
        >
          {additionalInfo.status}
        </div>
      )}
      {additionalInfo && (
        <div
          className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans"
          data-testid="diary-codes-next-step"
        >
          {additionalInfo.nextStep}
        </div>
      )}
      <Link
        className="usa-button"
        onClick={() => props.setActiveDebt(debt)}
        to="/debt-detail"
      >
        Go to debt details{' '}
        <i className="fa fa-chevron-right vads-u-font-size--sm" />
      </Link>
    </div>
  );
};

DebtLetterCard.propTypes = {
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

DebtLetterCard.defaultProps = {
  debt: {
    currentAr: 0,
    debtHistory: [{ date: '' }],
    deductionCode: '',
    originalAr: 0,
  },
};

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters.selectedDebt,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ setActiveDebt }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DebtLetterCard);
