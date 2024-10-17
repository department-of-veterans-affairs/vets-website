import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import YellowRibbonTableRows from './YellowRibbonTableRows';
import { isSmallScreen } from '../../utils/helpers';
import { yellowRibbonColumns as _yellowRibbonColumns } from '../../constants';

export const matchColumn = element => parseInt(element.id.split('-')[1], 10);

export const handleSort = (
  id,
  sortedPrograms,
  yellowRibbonColumns,
  setSortConfig,
  setSortedPrograms,
) => {
  setSortConfig(prev => {
    const isSameColumn = prev.column === id;
    const direction =
      isSameColumn && prev.direction === 'ascending'
        ? 'descending'
        : 'ascending';

    const sorted = [...sortedPrograms].sort((a, b) => {
      const { key } = Object.values(yellowRibbonColumns).find(
        col => col.id === id,
      );
      const valueA =
        key === 'contributionAmount' ? parseInt(a[key], 10) : a[key];
      const valueB =
        key === 'contributionAmount' ? parseInt(b[key], 10) : b[key];

      if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
      if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setSortedPrograms(sorted);
    return { column: id, direction };
  });
};

function YellowRibbonTable({ programs }) {
  const tableRef = useRef(null);
  const [sortedPrograms, setSortedPrograms] = useState([...programs]); // Copy initial programs
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: 'none',
  });
  const [smallScreen, setSmallScreen] = useState(isSmallScreen(750));

  const maxWidth = 750;

  // Using useEffect since click event doesn't register when adding onClick to va-icon.
  useEffect(
    () => {
      const tableElement = tableRef.current;

      const handleTableClick = event => {
        const clickedIcon = event.target.closest('va-icon');
        if (clickedIcon) {
          const columnId = matchColumn(clickedIcon);
          handleSort(
            columnId,
            sortedPrograms,
            _yellowRibbonColumns,
            setSortConfig,
            setSortedPrograms,
          );
        }
      };

      tableElement.addEventListener('click', handleTableClick);
      return () => tableElement.removeEventListener('click', handleTableClick);
    },
    [smallScreen, sortedPrograms],
  );

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
        stacked={smallScreen}
        ref={tableRef}
        key={smallScreen} // when smallScreen is changed in the handleResize event handler, no re-render occurs. This attribute forces a rerender.
      >
        <va-table-row slot="headers">
          {Object.values(_yellowRibbonColumns).map(column => {
            const isSortedColumn = sortConfig.column === column.id;

            const directionIcon =
              sortConfig.direction === 'ascending'
                ? 'arrow_upward'
                : 'arrow_downward';
            const iconDirection = isSortedColumn ? directionIcon : 'sort_arrow';

            return (
              <span key={column.id} className="yr-table-header">
                {column.description}
                <va-icon
                  icon={iconDirection}
                  size={3}
                  id={`icon-${column.id}`}
                  class="sort-icon"
                />
              </span>
            );
          })}
        </va-table-row>
        <YellowRibbonTableRows programs={sortedPrograms} />
      </va-table>
    </div>
  );
}

YellowRibbonTable.propTypes = { programs: PropTypes.array.isRequired };

export default YellowRibbonTable;
