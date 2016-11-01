import React from 'react';
import classNames from 'classnames';

class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeRow = this.makeRow.bind(this);
  }

  handleSort(value, order) {
    return () => this.props.onSort(value, order);
  }

  makeHeader(field) {
    // Determine what sort order the header will yield on the next click.
    // By default, clicking this header will sort in ascending order.
    // If it's already ascending, next click will sort it in descending order.
    let nextSortOrder = 'ASC';
    let sortIcon;

    if (this.props.currentSort.value === field.value) {
      const iconClass = classNames({
        fa: true,
        'fa-caret-down': this.props.currentSort.order === 'DESC',
        'fa-caret-up': this.props.currentSort.order === 'ASC'
      });

      sortIcon = <i className={iconClass}></i>;

      if (this.props.currentSort.order === 'ASC') {
        nextSortOrder = 'DESC';
      }
    }

    return (
      <th key={field.value}>
        <a onClick={this.handleSort(field.value, nextSortOrder)}>
          {field.label}
          {sortIcon}
        </a>
      </th>
    );
  }

  makeRow(item) {
    const cells = this.props.fields.map(field => {
      return <td key={`${item.id}-${field.value}`}>{item[field.value]}</td>;
    });
    return <tr key={item.id} className={item.rowClass}>{cells}</tr>;
  }

  render() {
    const headers = this.props.fields.map(this.makeHeader);
    const rows = this.props.data.map(this.makeRow);
    const tableClass = classNames('va-sortable-table', this.props.className);

    return (
      <table className={tableClass}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

SortableTable.propTypes = {
  className: React.PropTypes.string,

  // Field value to sort by in either ascending or descending order.
  // The `value` must be one of the values in the `fields` prop.
  currentSort: React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    order: React.PropTypes.oneOf(['ASC', 'DESC'])
  }).isRequired,

  // Mappings of header labels to properties on the objects in `data`.
  fields: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired
  })).isRequired,

  // Each object represents data for a row.
  // An optional class may be provided to style specific rows.
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    rowClass: React.PropTypes.string
  })).isRequired,

  onSort: React.PropTypes.func
};

export default SortableTable;
