import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const borderClasses =
  'vads-u-border-top--0 vads-u-border-right--0 vads-u-border-left--0 vads-u-padding--0 vads-u-padding-y--0p5 medium-screen:vads-u-padding--1';
const rowPaddingClass = 'vads-u-padding-y--2';

class ResponsiveTable extends React.Component {
  renderHeader = field => {
    return (
      <th key={field} className={borderClasses} role="columnheader">
        {field}
      </th>
    );
  };

  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  renderRow = item => {
    const { fields } = this.props;
    let extraClass = '';
    return (
      <tr
        key={item.id}
        className={`${borderClasses} ${rowPaddingClass}`}
        role="row"
      >
        {fields.map((field, index) => {
          // This is to right align the amount field and account number fields
          // since they are numeric
          if (index === 1 || index === 5) {
            extraClass =
              'vads-u-text-align--left medium-screen:vads-u-text-align--right';
          } else {
            extraClass = '';
          }
          return (
            <td
              data-index={index}
              className={`${borderClasses} ${extraClass}`}
              data-label={`${this.capitalizeFirstLetter(field)}:`}
              key={`${item.id}-${field}`}
              role="cell"
            >
              {item[field]}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { fields, data, tableClass } = this.props;
    const headers = fields.map(this.renderHeader);
    const rows = data?.map(this.renderRow());
    const classes = classNames('responsive', tableClass);

    return (
      <table className={classes} role="table">
        <thead>
          <tr role="row">{headers}</tr>
        </thead>
        <tbody>
          {this.props.children}
          {rows}
        </tbody>
      </table>
    );
  }
}

ResponsiveTable.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  tableClass: PropTypes.string,
};

export default ResponsiveTable;
