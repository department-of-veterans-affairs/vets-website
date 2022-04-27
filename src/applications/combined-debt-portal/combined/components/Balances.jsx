import React from 'react';
import head from 'lodash/head';
import moment from 'moment';
import BalanceCard from './BalanceCard';
import mockDebt from '../../../debt-letters/tests/e2e/fixtures/mocks/debts.json';
import mockBill from '../../../medical-copays/utils/mock-users/tony-stark.json';
import ZeroBalanceCard from './ZeroBalanceCard';
import Alerts from './Alerts';

export const IS_DEBT = true;

const calculateTotalDebts = debts => {
  return debts.reduce((acc, curr) => {
    return acc + curr.currentAr;
  }, 0);
};

const getLatestDebt = debts => {
  return debts.reduce((acc, curr) => {
    const mostRecentHistory = head(curr.debtHistory);
    // TODO: Probably should raise an error if there is no debt history
    if (mostRecentHistory) {
      if (!acc) {
        return mostRecentHistory.date;
      }
      return moment(acc, 'MM/DD/YYYY').isAfter(
        moment(mostRecentHistory.date, 'MM/DD/YYYY'),
      )
        ? acc
        : mostRecentHistory.date;
    }
    return acc;
  }, null);
};

const calculateTotalBills = bills => {
  return bills.reduce((acc, currDebt) => {
    return acc + currDebt.pHAmtDue;
  }, 0);
};

const getLatestBills = bills => {
  return bills.reduce((acc, currDebt) => {
    if (currDebt.pSStatementDate) {
      // TODO: Probably should raise an error if there is no statement date
      if (!acc) {
        return currDebt.pSStatementDate;
      }
      return moment(acc).isAfter(moment(currDebt.pSStatementDate))
        ? acc
        : currDebt.pSStatementDate;
    }
    return acc;
  }, null);
};

// Assumption: copays and debts are passed in as an array of objects
const Balances = () => {
  // const mcpError = useSelector(({ mcp }) => mcp.error);
  // const debtErrors = useSelector(({ debtLetters }) => debtLetters.error);
  // const debtError = debtErrors.length ? debtErrors[0] : [];

  // if (mcpError && debtError?.status) {
  //   return <div>Errors Card</div>;
  // }

  // if (zeroBalanceDebt && zeroBalanceBill) {
  //   return <div>No Balances Card</div>;
  // }

  return (
    <>
      <BalanceCard
        amount={calculateTotalDebts(mockDebt.debts)}
        count={mockDebt.debts.length}
        date={getLatestDebt(mockDebt.debts)}
        isDebt={IS_DEBT}
      />
      <BalanceCard
        amount={calculateTotalBills(mockBill)}
        count={mockBill.length}
        date={getLatestBills(mockBill)}
        isDebt={!IS_DEBT}
      />
      <ZeroBalanceCard isDebt={!IS_DEBT} />
      <ZeroBalanceCard isDebt={IS_DEBT} />
      <Alerts isDebt={!IS_DEBT} />
      <Alerts isDebt={IS_DEBT} />
    </>
  );
};

export default Balances;
