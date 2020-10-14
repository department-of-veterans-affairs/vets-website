import React, { Component } from 'react';
import classNames from 'classnames';

const borderClasses =
  'vads-u-border-top--0 vads-u-border-right--0 vads-u-border-left--0 vads-u-font-family--sans vads-u-padding--0 vads-u-padding-y--0p5 medium-screen:vads-u-padding--1';
const rowPaddingClass = 'vads-u-padding-y--2';

class ResponsiveTable extends Component {
  renderHeader = field => {
    if (field.nonSortable) {
      return <th key={field.value}>{field.label}</th>;
    }

    let sortIcon;

    if (this.props.currentSort.value === field.value) {
      const iconClass = classNames({
        fa: true,
        'fas fa-caret-down': this.props.currentSort.order === 'DESC',
        'fas fa-caret-up': this.props.currentSort.order === 'ASC',
      });

      sortIcon = <i className={iconClass} />;
    }

    return (
      <th
        key={field.value}
        className={borderClasses}
        role="columnheader"
        scope="col"
      >
        <button className="va-button-link vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none">
          {field.label}
          {sortIcon}
        </button>
      </th>
    );
  };

  renderRow = (item, rowIndex) => {
    const { fields } = this.props;
    let extraClass = '';
    return (
      <tr
        key={rowIndex}
        className={`${borderClasses} ${rowPaddingClass}`}
        role="row"
      >
        {fields.map((field, index) => {
          // This is to right align the amount field and account number fields
          // since they are numeric
          if (index === 1 || index === 5) {
            extraClass = 'vads-u-text-align--left';
          } else {
            extraClass = '';
          }
          return (
            <td
              data-index={index}
              className={`${borderClasses} ${extraClass}`}
              data-label={`${field.label}:`}
              key={`${rowIndex}-${field.label}`}
              role="cell"
            >
              {item[field.value] === null ? '---' : item[field.value]}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { data, fields } = this.props;
    const headers = fields.map(this.renderHeader);
    const rows = data.map(this.renderRow);

    return (
      <table
        aria-labelledby={this.props.ariaLabelledBy}
        className="responsive"
        role="table"
      >
        <thead>
          <tr role="row">{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default ResponsiveTable;
