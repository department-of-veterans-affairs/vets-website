import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import YellowRibbonTableRows from './YellowRibbonTableRows';
import { isSmallScreen } from '../../utils/helpers';
import { yellowRibbonColumns } from '../../constants';

function YellowRibbonTable({ programs }) {
  const [smallScreen, setSmallScreen] = useState(isSmallScreen(750));

  const maxWidth = 750;

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(isSmallScreen(maxWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <va-table
        uswds={!smallScreen}
        table-type="borderless"
        // stacked={smallScreen}
        columns={yellowRibbonColumns}
        sortable
        key={smallScreen} // when smallScreen is changed in the handleResize event handler, no re-render occurs. This attribute forces a rerender.
      >
        <va-table-row>
          {/* <va-table-row slot="headers"> */}
          {yellowRibbonColumns.map(column => {
            return (
              <span key={column.id} className="yr-table-header">
                {column.description}
              </span>
            );
          })}
        </va-table-row>
        <YellowRibbonTableRows programs={programs} />
      </va-table>
    </div>
  );
}

YellowRibbonTable.propTypes = { programs: PropTypes.array.isRequired };

export default YellowRibbonTable;
