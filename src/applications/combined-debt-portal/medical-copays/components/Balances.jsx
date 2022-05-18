import React from 'react';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import PropTypes from 'prop-types';
import BalanceCard from './BalanceCard';

export const Balances = ({ statements }) => {
  const single = <h2>What you owe to your facility</h2>;
  const multiple = (
    <h2>What you owe to your {statements?.length} facilities</h2>
  );

  return (
    <>
      {statements?.length === 1 ? single : multiple}

      {statements?.map((balance, idx) => {
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

Balances.propTypes = {
  statements: PropTypes.array,
};

export default Balances;
