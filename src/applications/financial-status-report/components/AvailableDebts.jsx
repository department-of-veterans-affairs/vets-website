import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

class AvailableDebts extends Component {
  componentDidMount() {
    this.props.fetchDebts();
  }

  render() {
    return (
      <>
        <h2 className="vads-u-font-size--h4">
          What debt do you need help with?
        </h2>
        <p>
          Select one or more debts below. We’ll help you choose a debt repayment
          or relief option for each.
        </p>
        <p>
          You will be able to choose a repayment option for each debt you
          select.
        </p>
        {this.props.debts.map((debt, index) => (
          <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
        ))}
        <h3 className="vads-u-font-size--h4">
          What if my debt isn’t listed here?
        </h3>
        <p className="vads-u-font-family--sans">
          If you received a letter about a VA benefit debt that isn’t listed
          here, call us at <Telephone contact="8008270648" /> (or{' '}
          <Telephone contact="16127136415" /> from overseas). We’re here Monday
          through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
        <p>
          If you need help with a VA copay debt,{' '}
          <a href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/">
            learn how to request financial hardship assistance.
          </a>
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
