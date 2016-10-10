import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';
import { set } from 'lodash/fp';

import { isValidSection } from '../../utils/validations';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/*
 * Each row can be three states: edit, complete, incomplete.
 *
 * The Add Another button is always displayed at the bottom, no matter the state of the rest of the rows.
 *
 * If there's only one row, the form will always show expanded (i.e. fields are visible) with no grey box.
 *
 * With more than one row:
 *
 * edit: Form is expanded inside grey box with Update/Remove buttons
 * complete: Form is collapsed inside grey box with Edit button
 * incomplete: Form is expanded inside grey box with Remove button
 *
 * The edit state is set when you click the Edit button. Complete is set for the current row when you add
 * another or update an existing one. Incomplete is set for the new row added after clicking Add Another.
 *
 * All rows are set to complete when the component is mounted (i.e. you're coming back to the page after adding a row previously).
*/

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

  scrollToTop() {
    scroller.scrollTo('topOfTable', {
      duration: 500,
      delay: 0,
      smooth: true,
      offset: -40
    });
  }

  createNewElement() {
    const blankRowData = this.props.createRow();
    blankRowData.key = _.uniqueId('key-');
    const rows = this.props.rows.slice();
    rows.push(blankRowData);
    this.props.onRowsUpdate(rows);

    this.setState({ [blankRowData.key]: 'incomplete' });
  }

  findIncomplete() {
    return _.findKey(this.state, v => v === 'incomplete');
  }

  handleAdd() {
    // Save existing
    const success = this.handleSave();

    if (success) {
      this.createNewElement();
    }
  }

  handleEdit(event) {
    this.setState({ [event.target.dataset.key]: 'edit' });
  }

  handleSave(event, index) {
    const key = event ? event.target.dataset.key : this.findIncomplete();
    const rowIndex = index !== undefined ? index : (this.props.rows.length - 1);

    let success = true;

    if (rowIndex !== undefined && this.props.isValidRow && this.props.isValidRow(this.props.rows[rowIndex])) {
      this.setState({ [key]: 'complete' });
    } else if (this.props.isValidSection(this.props.path, this.props.data)) {
      this.setState({ [key]: 'complete' });
    } else {
      this.props.initializeCurrentElement();
      success = false;
    }

    this.scrollToTop();

    return success;
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
    this.scrollToTop();
  }

  // TODO: change this to not use reaactKey, and instead perhaps add
  // `this.rows = []` in the constructor and update on changes
  render() {
    let reactKey = 0;
    let rowContent;
    const state = this.state;
    const rowElements = this.props.rows.map((obj, index) => {
      const stateKey = state[obj.key];
      if (stateKey && stateKey === 'complete' && this.props.rows.length > 1) {
        rowContent = (
          <div key={reactKey++} className="va-growable-background">
            <div className="row slideOutDown small-collapse" key={obj.key}>
              <div className="small-9 columns">
                {React.createElement(this.props.component,
                  { data: obj,
                    view: 'collapsed',
                    onValueChange: (subfield, update) => {
                      const newRows = set(`[${index}].${subfield}`, update, this.props.rows);
                      this.props.onRowsUpdate(newRows);
                    }
                  })}
              </div>
              <div className="small-3 columns">
                <button className="usa-button-outline float-right" onClick={(event) => this.handleEdit(event)} data-key={obj.key}>Edit</button>
              </div>
            </div>
          </div>
        );
      } else {
        let buttons;
        if (this.props.rows.length > 1) {
          buttons = (
            <div className="row small-collapse">
              {stateKey !== 'incomplete'
                ? <div className="small-6 left columns">
                  <button className="float-left" onClick={(event) => this.handleSave(event, index)} data-key={obj.key}>Update</button>
                </div>
                : null}
              <div className="small-6 right columns">
                <button className="usa-button-outline float-right" onClick={this.handleRemove} data-index={index}>Remove</button>
              </div>
            </div>
          );
        }
        rowContent = (
          <div key={reactKey++} className={(stateKey === 'edit' || this.props.rows.length > 1) ? 'va-growable-background' : null}>
            <div className="row small-collapse" key={obj.key}>
              <div className="small-12 columns va-growable-expanded">
                {React.createElement(this.props.component,
                  { data: obj,
                    view: 'expanded',
                    onValueChange: (subfield, update) => {
                      const newRows = set(`[${index}].${subfield}`, update, this.props.rows);
                      this.props.onRowsUpdate(newRows);
                    }
                  })}
              </div>
            </div>
            {buttons}
          </div>
        );
      }

      return rowContent;
    });

    return (
      <div className="va-growable">
        <Element name="topOfTable"/>
        {rowElements}
        <button className="usa-button-outline" onClick={this.handleAdd}>{this.props.addNewMessage || 'Add Another'}</button>
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
  rows: React.PropTypes.array.isRequired,
  isValidSection: React.PropTypes.func.isRequired,
  addNewMessage: React.PropTypes.string,
  minimumRows: React.PropTypes.number
};

GrowableTable.defaultProps = {
  isValidSection,
  minimumRows: 0
};

export default GrowableTable;
