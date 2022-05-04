import React from 'react';
import { isAfter } from 'date-fns';
import { useSelector } from 'react-redux';
import BalanceCard from './BalanceCard';
import ZeroBalanceCard from './ZeroBalanceCard';
import AlertCard from './AlertCard';
import ComboAlerts from './ComboAlerts';
import {
  calculateTotalDebts,
  calculateTotalBills,
  getLatestDebt,
  getLatestBill,
} from '../utils/balance-helpers';
import { APP_TYPES, ALERT_TYPES } from '../utils/helpers';

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
    return <ComboAlerts alertType={ALERT_TYPES.ERROR} />;
  }

  // get Debt info
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const latestDebt = getLatestDebt(debts);

  // get Bill info
  const bills = mcp.statements;
  const totalBills = calculateTotalBills(bills);
  const latestBill = getLatestBill(bills);

  // If there are no debts or bills, show zero balance card
  if (totalDebts === 0 && totalBills === 0) {
    return <ComboAlerts alertType={ALERT_TYPES.ZERO} />;
  }

  // Sort two valid BalancCards by date
  if (!debtError && !billError && totalDebts > 0 && totalBills > 0) {
    const debtFirst = isAfter(new Date(latestDebt), new Date(latestBill));
    return (
      <>
        <BalanceCard
          amount={debtFirst ? totalDebts : totalBills}
          count={debtFirst ? debts.length : bills.length}
          date={debtFirst ? latestDebt : latestBill}
          appType={debtFirst ? APP_TYPES.DEBT : APP_TYPES.BILL}
        />
        <BalanceCard
          amount={debtFirst ? totalBills : totalDebts}
          count={debtFirst ? bills.length : debts.length}
          date={debtFirst ? latestBill : latestDebt}
          appType={debtFirst ? APP_TYPES.BILL : APP_TYPES.DEBT}
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
            appType={APP_TYPES.DEBT}
          />
        )}
      {!billError &&
        totalBills > 0 && (
          <BalanceCard
            amount={totalBills}
            count={bills.length}
            date={latestBill}
            appType={APP_TYPES.COPAY}
          />
        )}
      {/* ZeroBalanceCards */}
      {!debtError &&
        totalDebts === 0 && <ZeroBalanceCard appType={APP_TYPES.DEBT} />}
      {!billError &&
        totalBills === 0 && <ZeroBalanceCard appType={APP_TYPES.COPAY} />}
      {/* AlertCards */}
      {debtError && <AlertCard appType={APP_TYPES.DEBT} />}
      {billError && <AlertCard appType={APP_TYPES.COPAY} />}
    </>
  );
};

export default Balances;
