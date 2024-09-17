import React, { useEffect, useRef, useState } from 'react';
import YellowRibbonTableRows from './YellowRibbonTableRows';
import { isSmallScreen } from '../../utils/helpers';
import { yellowRibbonColumns } from '../../constants';
import PropTypes from 'prop-types';

export const matchColumn = element => parseInt(element.id.split('-')[1]);

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
      const key = Object.values(yellowRibbonColumns).find(col => col.id === id)
        .key;
      const valueA = key === 'contributionAmount' ? parseInt(a[key]) : a[key];
      const valueB = key === 'contributionAmount' ? parseInt(b[key]) : b[key];

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
            yellowRibbonColumns,
            setSortConfig,
            setSortedPrograms,
          );
        }
      };

      if (tableElement) {
        tableElement.addEventListener('click', handleTableClick);
        return () =>
          tableElement.removeEventListener('click', handleTableClick);
      }
    },
    [smallScreen],
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
          {Object.values(yellowRibbonColumns).map(column => {
            const isSortedColumn = sortConfig.column === column.id;
            const iconDirection = isSortedColumn
              ? sortConfig.direction === 'ascending'
                ? 'arrow_upward'
                : 'arrow_downward'
              : 'sort_arrow';

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

YellowRibbonTable.propTypes = { program: PropTypes.array };

export default YellowRibbonTable;
