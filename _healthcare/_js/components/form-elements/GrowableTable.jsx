import React from 'react';
import _ from 'lodash';

import * as validations from '../../utils/validations';

class GrowableTable extends React.Component {
  constructor(props) {
    super(props);
    this.createNewElement = this.createNewElement.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.rows.length > 0) {
      this.props.rows.map((obj) => {
        this.setState({ [obj.key]: 'complete' });
        return true;
      });
    }
  }

  componentDidMount() {
    if (this.props.rows.length === 0) {
      this.createNewElement();
    }
  }

  createNewElement() {
    const blankRowData = this.props.createRow();
    blankRowData.key = _.uniqueId('key-');
    const rows = this.props.rows.slice();
    rows.push(blankRowData);
    this.props.onRowsUpdate(rows);

    this.setState({ [blankRowData.key]: 'incomplete' });
  }

  handleAdd() {
    if (validations.isValidSection(this.props.path, this.props.data)) {
      this.createNewElement();
    }
  }

  handleEdit(event) {
    this.setState({ [event.target.dataset.key]: 'incomplete' });
  }

  handleSave(event) {
    this.props.initializeCurrentElement();

    if (validations.isValidSection(this.props.path, this.props.data)) {
      this.setState({ [event.target.dataset.key]: 'complete' });
      document.getElementsByClassName('input-section')[1].scrollIntoView();
    } else {
      // TODO: figure out how to deal with the fact that this runs before the
      // child component renders, so there will be no error classes yet
      document.getElementsByClassName('usa-input-error')[0].scrollIntoView();
    }
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

  // TODO: change this to not use reaactKey, and instead perhaps add
  // `this.rows = []` in the constructor and update on changes
  render() {
    let reactKey = 0;
    let rowContent;
    const state = this.state;
    const rowElements = this.props.rows.map((obj, index) => {
      if (state[obj.key] && state[obj.key] === 'complete') {
        rowContent = (
          <div key={reactKey++}>
            <div className="row" key={obj.key}>
              <div className="small-6 columns">
                {React.createElement(this.props.component,
                  { data: obj,
                    view: 'collapsed',
                    onValueChange: (subfield, update) => {
                      const rows = this.props.rows.slice();
                      const newRow = Object.assign({}, rows[index]);
                      newRow[subfield] = update;
                      rows[index] = newRow;
                      this.props.onRowsUpdate(rows);
                    }
                  })}
              </div>
              <div className="small-3 columns">
                <button onClick={(event) => this.handleEdit(event)} data-key={obj.key}>Edit</button>
              </div>
              <div className="small-3 columns">
                <button onClick={this.handleRemove} data-index={index}>Remove</button>
              </div>
            </div>
            <hr/>
          </div>
        );
      } else {
        rowContent = (
          <div key={reactKey++}>
            <div className="row">
              <div className="small-3 right columns">
                <button onClick={this.handleRemove} data-index={index}>Remove</button>
              </div>
            </div>
            <div className="row" key={obj.key}>
              <div className="small-12 columns">
                {React.createElement(this.props.component,
                  { data: obj,
                    view: 'expanded',
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
            <div className="row">
              <div className="small-3 right columns">
                <button onClick={(event) => this.handleSave(event)} data-key={obj.key}>Save</button>
              </div>
            </div>
            <hr/>
          </div>
        );
      }

      return rowContent;
    });

    return (
      <div>
        {rowElements}
        <div className="row">
          <div className="small-3 small-centered columns">
            <button onClick={this.handleAdd}>Add</button>
          </div>
        </div>
      </div>
    );
  }
}

GrowableTable.propTypes = {
  component: React.PropTypes.func.isRequired,
  createRow: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeCurrentElement: React.PropTypes.func.isRequired,
  onRowsUpdate: React.PropTypes.func.isRequired,
  path: React.PropTypes.string.isRequired,
  rows: React.PropTypes.array.isRequired
};

export default GrowableTable;
