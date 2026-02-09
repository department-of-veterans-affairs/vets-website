import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { showVHAPaymentHistory } from '../../combined/utils/helpers';
import HTMLStatementLink from './HTMLStatementLink';

const PreviousStatements = ({ selectedId }) => {
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  const copayDetail =
    useSelector(state => state.combinedPortal.mcp.selectedStatement) || {};
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.statements) || [];

  // For VHA Payment History (new API), use recentStatements from the detail response
  // Filter out the current statement
  const previousStatements = shouldShowVHAPaymentHistory
    ? (copayDetail?.attributes?.recentStatements || []).filter(
        copay => copay.id !== selectedId,
      )
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
            return dateB - dateA; // Sort descending (newest first)
          });
      })();

  // Don't render anything if there are no previous statements
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
              shouldShowVHAPaymentHistory
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
