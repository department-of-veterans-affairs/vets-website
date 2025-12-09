import React from 'react';
import { isAfter } from 'date-fns';
import { useSelector } from 'react-redux';
import BalanceCard from './BalanceCard';
import ZeroBalanceCard from './ZeroBalanceCard';
import AlertCard from './AlertCard';
import { calculateTotalDebts, getLatestDebt } from '../utils/balance-helpers';
import { APP_TYPES } from '../utils/helpers';
import MCPAlert from './MCPAlerts';

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
  const isEnrolledInHealthCare = billError?.code !== '403' ?? true;

  // get Debt info
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const latestDebt = getLatestDebt(debts);

  // get Bill info
  const copayData = mcp.statements || [];
  const totalBills = copayData.meta.total;
  const latestBillDate = new Date(copayData.meta.copaySummary.lastUpdatedOn);

  // Sort two valid BalancCards by date
  if (!debtError && !billError && totalDebts > 0 && totalBills > 0) {
    const debtFirst = isAfter(new Date(latestDebt), latestBillDate);
    return (
      <>
        <BalanceCard
          amount={debtFirst ? totalDebts : totalBills}
          count={debtFirst ? debts.length : totalBills}
          date={debtFirst ? latestDebt : latestBillDate}
          appType={debtFirst ? APP_TYPES.DEBT : APP_TYPES.BILL}
        />
        <BalanceCard
          amount={debtFirst ? totalBills : totalDebts}
          count={debtFirst ? totalBills : debts.length}
          date={debtFirst ? latestBillDate : latestDebt}
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
      {isEnrolledInHealthCare &&
        !billError &&
        totalBills > 0 && (
          <BalanceCard
            amount={totalBills}
            count={totalBills}
            date={latestBillDate}
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
      {isEnrolledInHealthCare &&
        billError && <AlertCard appType={APP_TYPES.COPAY} />}
      {!isEnrolledInHealthCare && (
        <>
          <MCPAlert type="no-health-care" />
        </>
      )}
    </>
  );
};

export default Balances;
