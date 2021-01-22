import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createId } from '../utils/helpers';

class ResponsiveTable extends React.Component {
  renderHeader = column => {
    return (
      <th key={`${createId(column)}`} role="columnheader" scope="col">
        {column}
      </th>
    );
  };

  /**
   * @param row The object representing columns in this can either be a string for simple tables, a react element,
   *            or an object for tables that need options for individual rows
   * @param column The column name
   */
  renderRowCell = (row, column) => {
    const columnData = row[column];

    // This handles the case where columnData is a react.element
    let cellData = columnData;
    // Default to column value displayed on desktop
    let mobileHeaderValue = column;

    const stringCellData = value => (
      <span className={'vads-u-margin-0'}>{value}</span>
    );

    if (typeof columnData === 'string') {
      cellData = stringCellData(columnData);
    } else if (columnData.value) {
      const { value, mobileHeader } = columnData;

      cellData = value;
      if (typeof value === 'string') {
        cellData = stringCellData(value);
      }

      if (mobileHeader) {
        mobileHeaderValue = mobileHeader;
      }
    }

    return (
      <>
        <dfn className="medium-screen:vads-u-display--none vads-u-font-weight--bold">
          {mobileHeaderValue}:{' '}
        </dfn>
        {cellData}
      </>
    );
  };

  renderRow = row => {
    const { columns } = this.props;
    const { key, rowClassName } = row;
    return (
      <>
        <hr className="responsive-table-row-separator" />
        <tr key={key} className={rowClassName} role="row">
          {columns.map((column, index) => {
            const cellName = createId(column);

            if (index === 0) {
              return (
                <th
                  className={`${cellName}-cell`}
                  scope="row"
                  /* eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role */
                  role="rowheader"
                  tabIndex="-1"
                  key={`${key}-${cellName}`}
                >
                  {this.renderRowCell(row, column)}
                </th>
              );
            }
            return (
              <td
                className={`${cellName}-cell`}
                role="cell"
                key={`${key}-${cellName}`}
              >
                {this.renderRowCell(row, column)}
              </td>
            );
          })}
        </tr>
      </>
    );
  };

  render() {
    const { columns, data, tableClass } = this.props;
    const headers = columns.map(this.renderHeader);
    const classes = classNames('responsive', tableClass);
    const rows = data.map(this.renderRow);

    return (
      <table className={classes} role="table">
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <thead role="rowgroup">
          <tr role="row">{headers}</tr>
        </thead>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <tbody role="rowgroup">{rows}</tbody>
      </table>
    );
  }
}

ResponsiveTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  tableClass: PropTypes.string,
};

export default ResponsiveTable;
