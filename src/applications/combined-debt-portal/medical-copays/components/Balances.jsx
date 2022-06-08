import React from 'react';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import PropTypes from 'prop-types';
import BalanceCard from './BalanceCard';

export const Balances = ({ statements }) => {
  const single = <h2 id="balance-list">What you owe to your facility</h2>;
  const multiple = (
    <h2 id="balance-list">
      What you owe to your {statements?.length} facilities
    </h2>
  );

  return (
    <>
      {statements?.length === 1 ? single : multiple}
      <ul className="no-bullets vads-u-padding-x--0">
        {statements?.map((balance, idx) => {
          const facilityName =
            balance.station.facilityName ||
            getMedicalCenterNameByID(balance.station.facilitYNum);

          return (
            <li key={idx}>
              <BalanceCard
                id={balance.id}
                amount={balance.pHAmtDue}
                date={balance.pSStatementDateOutput}
                city={balance.station.city}
                facility={facilityName}
                key={balance.id ? balance.id : `${idx}-${balance.facilitYNum}`}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

Balances.propTypes = {
  statements: PropTypes.array,
};

export default Balances;
