import React from 'react';
import last from 'lodash/last';
import moment from 'moment';
import { Link } from 'react-router';
import { deductionCodes } from '../const';
import { bindActionCreators } from 'redux';
import { setActiveDebt } from '../actions';
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
        {deductionCodes[debt.deductionCode]} updated{' '}
        {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
      </h4>
      <p className="vads-u-margin-bottom--0 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--sans">
        Amount owed:
      </p>
      <p className="vads-u-margin-top--0 vads-u-font-size--md vads-u-font-family--sans">
        {formatter.format(parseFloat(debt.currentAr))}
      </p>
      <p className="vads-u-margin-bottom--0 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--sans">
        Status:
      </p>
      <p className="vads-u-margin-top--0 vads-u-font-size--md vads-u-font-family--sans">
        {mostRecentHistory.status}
      </p>
      <p className="vads-u-margin-bottom--0 vads-u-font-size--md vads-u-font-weight--bold vads-u-font-family--sans">
        Next step:
      </p>
      <p className="vads-u-margin-top--0 vads-u-font-size--md vads-u-font-family--sans">
        {/* ToDo: figure out how to derive next steps from data */}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium,
        aliquam delectus error est eveniet exercitationem facere fugiat ipsa
        laboriosam libero modi, odit quia ratione. Assumenda consectetur iusto
        perferendis repellat suscipit?
      </p>
      <Link
        className="usa-button vads-u-padding-x--1"
        onClick={() => props.setActiveDebt(debt)}
        to="/view-details"
      >
        View debt details <i className="fa fa-chevron-right" />
      </Link>
    </div>
  );
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
