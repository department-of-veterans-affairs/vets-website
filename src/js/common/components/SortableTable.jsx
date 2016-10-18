import React from 'react';

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
    // By default, it will be ascending. Only make it descending if
    // the current field is already sorted on in ascending order.
    let nextSortOrder = 'ASC';
    let sortIcon;

    if (this.props.currentSort.value === field.value) {
      if (this.props.currentSort.order === 'DESC') {
        // Current icon will be descending.
        // Next click will be ascending.
        sortIcon = <i className="fa fa-caret-down"></i>;
      } else {
        // Current icon will be ascending.
        // Next click will be descending.
        sortIcon = <i className="fa fa-caret-up"></i>;
        nextSortOrder = 'DESC';
      }
    }

    return (
      <th key={field.value}>
        <a onClick={this.handleSort(field.value, nextSortOrder)}>
          {field.label}&nbsp;&nbsp;&nbsp;{sortIcon}
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

    return (
      <table className={this.props.className}>
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
