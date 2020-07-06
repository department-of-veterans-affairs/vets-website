import React, { Component } from 'react';
import classNames from 'classnames';
import './ResponsiveTable.scss';

const borderClasses =
  'vads-u-border-top--0 vads-u-border-right--0 vads-u-border-left--0 vads-u-font-family--sans vads-u-padding--1';
const paddingClasses = '';

class ResponsiveTable extends Component {
  renderHeader = field => {
    if (field.nonSortable) {
      return <th key={field.value}>{field.label}</th>;
    }

    // Determine what sort order the header will yield on the next click.
    // By default, clicking this header will sort in ascending order.
    // If it’s already ascending, next click will sort it in descending order.
    let nextSortOrder = 'ASC';
    let sortIcon;

    if (this.props.currentSort.value === field.value) {
      const iconClass = classNames({
        fa: true,
        'fas fa-caret-down': this.props.currentSort.order === 'DESC',
        'fas fa-caret-up': this.props.currentSort.order === 'ASC',
      });

      sortIcon = <i className={iconClass} />;

      if (this.props.currentSort.order === 'ASC') {
        nextSortOrder = 'DESC';
      }
    }

    return (
      <th key={field.value} className={borderClasses}>
        <button
          className="va-button-link vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none"
          onClick={this.onHeaderClick(field.value, nextSortOrder)}
          tabIndex="0"
        >
          {field.label}
          {sortIcon}
        </button>
      </th>
    );
  };

  renderRow = item => {
    const { fields } = this.props;
    let extraClass = '';
    return (
      <tr key={item.id} className={borderClasses}>
        {fields.map((field, index) => {
          // This is to right align the amount field and account number fields
          // since they are numeric
          if (index === 1 || index === 5) {
            extraClass = 'vads-u-text-align--right';
          } else {
            extraClass = '';
          }
          return (
            <td
              data-index={index}
              className={`${borderClasses} ${extraClass}`}
              data-label={field.value}
              key={`${item.id}-${field.value}`}
            >
              {item[field.value]}
            </td>
          );
        })}
      </tr>
    );
  };

  onHeaderClick = (value, order) => () => {
    // This replaces `this.props.onSort`.
    this.props.onHeaderClick(value, order);
  };

  render() {
    const { className, data, fields } = this.props;
    const headers = fields.map(this.renderHeader);
    const rows = data.map(this.renderRow);
    const tableClass = classNames('va-sortable-table responsive', className);

    return (
      <table className={tableClass}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default ResponsiveTable;
