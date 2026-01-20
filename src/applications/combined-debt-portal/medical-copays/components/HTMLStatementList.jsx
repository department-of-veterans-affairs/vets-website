import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  sortStatementsByDate,
  showVHAPaymentHistory,
} from '../../combined/utils/helpers';
import HTMLStatementLink from './HTMLStatementLink';

const HTMLStatementList = ({ selectedId }) => {
  const shouldShowVHAPaymentHistory = state => {
    showVHAPaymentHistory(state);
  };

  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? {};

  // normalize to array
  let statementArray = [];
  if (Array.isArray(statements.data)) {
    statementArray = statements.data;
  } else if (statements.data) {
    statementArray = [statements.data];
  }

  const selectedCopay = shouldShowVHAPaymentHistory
    ? statementArray.find(({ id }) => id === selectedId)
    : statements.find(({ id }) => id === selectedId);

  const facilityNumber = selectedCopay?.attributes?.facilityNumber;

  const facilityCopays = statementArray.filter(
    ({ attributes }) => attributes?.facilityNumber === facilityNumber,
  );

  const sortedFacilityCopays = sortStatementsByDate(facilityCopays);

  // otpp just shows previous statements
  const previousSortedFacilityCopays = sortedFacilityCopays.filter(
    copay => copay.id !== selectedId,
  );

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
        {previousSortedFacilityCopays.map(statement => (
          <HTMLStatementLink
            id={statement.id}
            statementDate={
              shouldShowVHAPaymentHistory
                ? statement?.attributes?.invoiceDate
                : statement.pSStatementDateOutput
            }
            key={statement.id}
          />
        ))}
      </ul>
    </article>
  );
};

HTMLStatementList.propTypes = {
  selectedId: PropTypes.string,
};

export default HTMLStatementList;
