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

  makeHeader(field, index) {
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
      <th key={index}>
        <a onClick={this.handleSort(field.value, nextSortOrder)}>
          {field.label}&nbsp;&nbsp;&nbsp;{sortIcon}
        </a>
      </th>
    );
  }

  makeRow(item, index) {
    let cellIndex = 0;
    const cells = this.props.fields.map(field => {
      return <td key={cellIndex++}>{item[field.value]}</td>;
    });
    return <tr key={index}>{cells}</tr>;
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
  currentSort: React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    order: React.PropTypes.oneOf(['ASC', 'DESC'])
  }).isRequired,
  // Mappings of each header label to the property on each data object.
  fields: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired
  })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSort: React.PropTypes.func
};

export default SortableTable;
