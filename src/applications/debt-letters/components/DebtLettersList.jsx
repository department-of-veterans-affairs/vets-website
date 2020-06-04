import React from 'react';
import DebtLetterCard from './DebtLetterCard';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

const DebtLettersList = ({ debts }) => (
  <>
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/debt-letters">Debt Letters</a>
      <a href="/debt-letters/debt-list">Debt List</a>
    </Breadcrumbs>
    {debts.length &&
      debts.map((debt, index) => (
        <DebtLetterCard key={`${index}-${debt.fileNumber}`} debt={debt} />
      ))}
  </>
);

const mapStateToProps = state => ({
  debts: state.debtLetters.debts,
});

export default connect(mapStateToProps)(DebtLettersList);
