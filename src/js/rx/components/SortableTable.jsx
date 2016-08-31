import React from 'react';

class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeRow = this.makeRow.bind(this);
  }

  makeHeader(field, index) {
    return <th key={index}>{field.label}</th>;
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
  // Mappings of each header label to the property on each data object.
  fields: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired
  })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default SortableTable;
