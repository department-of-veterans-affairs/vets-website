import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { showCopayPaymentHistory } from '../../combined/utils/selectors';
import HTMLStatementLink from './HTMLStatementLink';

const PreviousStatements = ({ selectedId }) => {
  const shouldShowCopayPaymentHistory = showCopayPaymentHistory(
    useSelector(state => state),
  );

  const copayDetail =
    useSelector(state => state.combinedPortal.mcp.currentCopay) || {};
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.copays) || [];

  const previousStatements = shouldShowCopayPaymentHistory
    ? copayDetail?.attributes?.recentStatements || []
    : (() => {
        // Legacy logic for old data
        const selectedCopay = allStatements.find(({ id }) => id === selectedId);
        const facilityId = selectedCopay?.station?.stationNumber;

        return allStatements
          .filter(
            statement =>
              statement.station?.stationNumber === facilityId &&
              statement.id !== selectedId,
          )
          .sort((a, b) => {
            const dateA = new Date(a.pSStatementDateOutput);
            const dateB = new Date(b.pSStatementDateOutput);
            return dateB - dateA;
          });
      })();

  if (previousStatements.length === 0) {
    return null;
  }

  return (
    <article data-testid="view-statements" className="vads-u-padding--0">
      <h2 id="statement-list" className="vads-u-margin-top--2">
        Previous statements
      </h2>
      <p>
        Review your charges and download your mailed statements from the past 6
        months for this facility.
      </p>
      <ul className="no-bullets vads-u-x--0" data-testid="otpp-statement-list">
        {previousStatements.map(statement => (
          <HTMLStatementLink
            id={statement.id}
            statementDate={
              shouldShowCopayPaymentHistory
                ? statement.invoiceDate
                : statement.pSStatementDateOutput
            }
            key={statement.id}
          />
        ))}
      </ul>
    </article>
  );
};

PreviousStatements.propTypes = {
  selectedId: PropTypes.string,
};

export default PreviousStatements;
