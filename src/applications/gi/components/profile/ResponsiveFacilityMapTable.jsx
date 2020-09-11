import React, { Component } from 'react';

const borderClasses =
  'vads-u-border-top--0 vads-u-border-right--0 vads-u-border-left--0 vads-u-padding--0 vads-u-padding-y--0p5 medium-screen:vads-u-padding--1';
const rowPaddingClass = 'vads-u-padding-y--2';

class ResponsiveFacilityMapTable extends Component {
  renderHeader = field => {
    return (
      <th key={field.label} className={borderClasses}>
        {field.label}
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
      <tr key={item.id} className={`${borderClasses} ${rowPaddingClass}`}>
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
              data-label={`${this.capitalizeFirstLetter(field.value)}:`}
              key={`${item.id}-${field.value}`}
            >
              {item[field.value]}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { fields, mainRow, branchesAndExtensionsRows } = this.props;
    const headers = fields.map(this.renderHeader);

    return (
      <table className="responsive">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {mainRow}
          {branchesAndExtensionsRows}
        </tbody>
      </table>
    );
  }
}

export default ResponsiveFacilityMapTable;
