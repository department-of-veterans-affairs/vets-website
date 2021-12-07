import React from 'react';
import BalanceCard from './BalanceCard';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';

export const Balances = ({ statementData }) => {
  const single = <h2>What you owe to your facility</h2>;
  const multiple = (
    <h2>What you owe to your {statementData?.length} facilities</h2>
  );

  return (
    <>
      {statementData?.length === 1 ? single : multiple}

      {statementData?.map((balance, idx) => {
        const facilityName =
          balance.station.facilityName ||
          getMedicalCenterNameByID(balance.station.facilitYNum);

        return (
          <BalanceCard
            id={balance.id}
            amount={balance.pHAmtDue}
            date={balance.pSStatementDate}
            city={balance.station.city}
            facility={facilityName}
            key={balance.id ? balance.id : `${idx}-${balance.facilitYNum}`}
          />
        );
      })}
    </>
  );
};

export default Balances;
