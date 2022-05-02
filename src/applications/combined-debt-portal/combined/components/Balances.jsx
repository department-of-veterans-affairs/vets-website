import React from 'react';
import head from 'lodash/head';
import moment from 'moment';
import { useSelector } from 'react-redux';
import BalanceCard from './BalanceCard';
import ZeroBalanceCard from './ZeroBalanceCard';
import AlertCard from './AlertCard';
import ComboAlerts from './ComboAlerts';

export const IS_DEBT = true;

export const calculateTotalDebts = debts => {
  return debts
    ? debts.reduce((acc, curr) => {
        return acc + curr.currentAr;
      }, 0)
    : 0;
};

export const getLatestDebt = debts => {
  return debts
    ? debts.reduce((acc, curr) => {
        const mostRecentHistory = head(curr.debtHistory);
        if (mostRecentHistory) {
          if (!acc) {
            return mostRecentHistory.date;
          }
          return moment(acc).isAfter(moment(mostRecentHistory.date))
            ? acc
            : mostRecentHistory.date;
        }
        return acc;
      }, null)
    : null;
};

export const calculateTotalBills = bills => {
  return bills
    ? bills.reduce((acc, currDebt) => {
        return acc + currDebt.pHAmtDue;
      }, 0)
    : 0;
};

export const getLatestBills = bills => {
  return bills
    ? bills.reduce((acc, currDebt) => {
        if (currDebt.pSStatementDate) {
          if (!acc) {
            return currDebt.pSStatementDate;
          }
          return moment(acc).isAfter(moment(currDebt.pSStatementDate))
            ? acc
            : currDebt.pSStatementDate;
        }
        return acc;
      }, null)
    : null;
};

// Some terminology that could be helpful:
// debt(s) = debtLetters
// bill(s) = copays = mcp (medical-copays)
const Balances = () => {
  // get balances from redux
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );

  // Single out errors
  const billError = mcp.error;
  const debtError = debtLetters.errors?.length > 0;

  // Both Error, show combo alert
  if (billError && debtError) {
    return <ComboAlerts type="error" />;
  }

  // get Debt info
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const latestDebt = getLatestDebt(debts);

  // get Bill info
  const bills = mcp.statements;
  const totalBills = calculateTotalBills(bills);
  const latestBills = getLatestBills(bills);

  // If there are no debts or bills, show zero balance card
  if (totalDebts === 0 && totalBills === 0) {
    return <ComboAlerts type="zero-balances" />;
  }

  // Sort two valid BalancCards by date
  if (!debtError && !billError && totalDebts > 0 && totalBills > 0) {
    const debtFirst = moment(latestDebt).isAfter(moment(latestBills));
    return (
      <>
        <BalanceCard
          amount={debtFirst ? totalDebts : totalBills}
          count={debtFirst ? debts.length : bills.length}
          date={debtFirst ? latestDebt : latestBills}
          isDebt={debtFirst}
        />
        <BalanceCard
          amount={debtFirst ? totalBills : totalDebts}
          count={debtFirst ? bills.length : debts.length}
          date={debtFirst ? latestBills : latestDebt}
          isDebt={!debtFirst}
        />
      </>
    );
  }

  // Sorting and returning cards
  // Order matters here:
  // BalanceCard > ZeroBalanceCard > AlertCard
  return (
    <>
      {/* BalanceCards */}
      {!debtError &&
        totalDebts > 0 && (
          <BalanceCard
            amount={totalDebts}
            count={debts.length}
            date={latestDebt}
            isDebt={IS_DEBT}
          />
        )}
      {!billError &&
        totalBills > 0 && (
          <BalanceCard
            amount={totalBills}
            count={bills.length}
            date={latestBills}
            isDebt={!IS_DEBT}
          />
        )}
      {/* ZeroBalanceCards */}
      {!debtError && totalDebts === 0 && <ZeroBalanceCard isDebt={IS_DEBT} />}
      {!billError && totalBills === 0 && <ZeroBalanceCard isDebt={!IS_DEBT} />}
      {/* AlertCards */}
      {debtError && <AlertCard isDebt={IS_DEBT} />}
      {billError && <AlertCard isDebt={!IS_DEBT} />}
    </>
  );
};

export default Balances;
