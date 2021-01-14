import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

class AvailableDebts extends Component {
  componentDidMount() {
    this.props.fetchDebts();
  }

  render() {
    return (
      <>
        <h2 className="vads-u-font-size--h4">
          Which debts do you need help with?
        </h2>
        <p>
          Please select at least one debt for payment plan, compromise, or
          waiver consideration.
        </p>
        <p>
          You will be able to choose a repayment option for each debt you
          select.
        </p>
        {this.props.debts.map((debt, index) => (
          <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
        ))}
        <h3 className="vads-u-font-size--h4">
          What if I don't see the debt I'm looking for?
        </h3>
        <p className="vads-u-font-family--sans">
          If you’ve received a letter about a VA debt, but don’t see it listed
          here call the Debt Management Center (DMC) at{' '}
          <Telephone contact="8008270648" />
          {'.'}
        </p>
        <p>
          For medical copayment debt, please go to Request financial hardship
          assistance for copay bills to learn about your assistance options.
        </p>
      </>
    );
  }
}

const mapStateToProps = state => ({
  debts: state.fsr.debts,
});

const mapDispatchToProps = {
  fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableDebts);
