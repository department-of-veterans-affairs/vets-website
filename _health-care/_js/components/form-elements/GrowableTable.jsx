import React from 'react';
import _ from 'lodash';

class GrowableTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleAdd() {
    const blankRowData = this.props.createRow();
    blankRowData.key = _.uniqueId('key-');
    const rows = this.props.rows.slice();
    rows.push(blankRowData);
    this.props.onRowsUpdate(rows);
  }

  handleRemove(event) {
    const indexToRemove = Number(event.target.dataset.index);
    const rows = [];
    this.props.rows.every((obj, index) => {
      if (index !== indexToRemove) {
        rows.push(obj);
      }
      return true;
    });
    this.props.onRowsUpdate(rows);
  }

  render() {
    const rowElements = this.props.rows.map((obj, index) => {
      return (
        <div className="row" key={obj.key}>
          <hr/>
          <div className="small-3 columns">
            <button onClick={this.handleRemove} data-index={index}>Remove</button>
          </div>
          <div className="small-9 columns">
            {React.createElement(this.props.component,
              { data: obj,
                onValueChange: (subfield, update) => {
                  const rows = this.props.rows.slice();
                  const newRow = Object.assign({}, rows[index]);
                  newRow[subfield] = update;
                  rows[index] = newRow;
                  this.props.onRowsUpdate(rows);
                }
              })}
          </div>
        </div>
      );
    });
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <button onClick={this.handleAdd}>Add</button>
          </div>
        </div>
        {rowElements}
      </div>
    );
  }
}

GrowableTable.propTypes = {
  component: React.PropTypes.func.isRequired,
  createRow: React.PropTypes.func.isRequired,
  onRowsUpdate: React.PropTypes.func.isRequired,
  rows: React.PropTypes.array.isRequired
};

export default GrowableTable;
