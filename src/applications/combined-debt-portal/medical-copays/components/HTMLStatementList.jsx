import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { sortStatementsByDate } from '../../combined/utils/helpers';
import HTMLStatementLink from './HTMLStatementLink';

const HTMLStatementList = ({ selectedId }) => {
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  // get selected statement
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);
  // get facility  number on selected statement
  const facilityNumber = selectedCopay.pSFacilityNum;
  // filter out all statements that are not related to this facility
  const facilityCopays = statements.filter(
    ({ pSFacilityNum }) => pSFacilityNum === facilityNumber,
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
            statementDate={statement.pSStatementDateOutput}
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
