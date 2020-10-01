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

  renderRow = item => {
    const { columns } = this.props;
    const { key, rowClassName } = item;
    return (
      <tr key={key} className={rowClassName} role="row">
        {columns.map((field, index) => {
          const cellName = createId(field);
          if (index === 0) {
            return (
              <th
                className={`${cellName}-cell`}
                scope="row"
                /* eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role */
                role="cell"
                tabIndex="-1"
                key={`${key}-${cellName}`}
              >
                {item[field]}
              </th>
            );
          }

          return (
            <td
              className={`${cellName}-cell`}
              role="cell"
              key={`${key}-${cellName}`}
            >
              {item[field]}
            </td>
          );
        })}
      </tr>
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
