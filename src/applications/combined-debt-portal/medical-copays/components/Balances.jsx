import React from 'react';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import PropTypes from 'prop-types';
import BalanceCard from './BalanceCard';
import { formatISODateToMMDDYYYY } from '../../combined/utils/helpers';

export const Balances = ({
  copays,
  paginationText,
  showCopayPaymentHistory = false,
}) => {
  const single = (
    <>
      <h2 id="balance-list" className="vads-u-margin-top--2">
        What you owe to your facility
      </h2>
    </>
  );
  const multiple = (
    <>
      <h2 id="balance-list" className="vads-u-margin-top--2">
        Your most recent statement balances for the last six months
      </h2>
      {paginationText && <p>{paginationText}</p>}
    </>
  );

  return (
    <>
      {copays?.length === 1 ? single : multiple}
      {showCopayPaymentHistory ? null : (
        <p>
          Any payments you have made will not be reflected here until our
          systems are updated with your next monthly statement.
        </p>
      )}
      <ul className="no-bullets vads-u-padding-x--0">
        {copays?.map((balance, idx) => {
          const facilityName = showCopayPaymentHistory
            ? balance.attributes.facility ||
              getMedicalCenterNameByID(balance.attributes.facility)
            : balance.station.facilityName ||
              getMedicalCenterNameByID(balance.station.facilityNum);

          return (
            <li key={idx} className="vads-u-max-width--none">
              <BalanceCard
                id={balance.id}
                amount={
                  showCopayPaymentHistory
                    ? balance.attributes.currentBalance
                    : balance.pHAmtDue
                }
                date={
                  showCopayPaymentHistory
                    ? formatISODateToMMDDYYYY(balance.attributes.lastUpdatedAt)
                    : balance.pSStatementDateOutput
                }
                city={
                  showCopayPaymentHistory
                    ? balance.attributes?.city
                    : balance.station.city
                }
                facility={facilityName}
                key={balance.id ? balance.id : `${idx}-${facilityName}`}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

Balances.propTypes = {
  copays: PropTypes.array,
  paginationText: PropTypes.string,
  showCopayPaymentHistory: PropTypes.bool,
};

export default Balances;
