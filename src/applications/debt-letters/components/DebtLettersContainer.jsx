import React from 'react';
import DebtLetterCard from './DebtLetterCard';

const DebtLettersContainer = ({ debts }) => (
  <>
    {debts.length &&
      debts.map((debt, index) => (
        <DebtLetterCard key={`${index}-${debt.fileNumber}`} debt={debt} />
      ))}
  </>
);

export default DebtLettersContainer;
