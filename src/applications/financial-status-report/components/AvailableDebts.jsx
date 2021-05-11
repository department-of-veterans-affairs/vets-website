import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';

const AvailableDebts = ({ debts, getDebts }) => {
  useEffect(
    () => {
      getDebts();
    },
    [getDebts],
  );

  return (
    <>
      <p className="vads-u-margin-bottom--3">
        You will be able to choose a repayment option for each debt you select.
      </p>
      {debts.map((debt, index) => (
        <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
      ))}
    </>
  );
};

const mapStateToProps = ({ fsr }) => ({
  debts: fsr.debts,
});

const mapDispatchToProps = {
  getDebts: fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableDebts);
