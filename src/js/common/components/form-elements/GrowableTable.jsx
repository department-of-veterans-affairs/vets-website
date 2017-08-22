import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';
import { set } from 'lodash/fp';

import { getScrollOptions, scrollAndFocus } from '../../utils/helpers';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/*
 * Each row can be three states: edit, complete, incomplete.
 *
 * The Add Another button is always displayed at the bottom, no matter the state of the rest of the rows.
 *
 * If there’s only one row, the form will always show expanded (i.e. fields are visible) with no grey box.
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
 * All rows are set to complete when the component is mounted (i.e. you’re coming back to the page after adding a row previously).
 * component - The component to render for each item in the table
 * createRow - Function called to create a new row
 * data - Form data
 * initializeCurrentElement - Function called to set all fields in element to dirty
 * onRowsUpdate - Function called to update form data with row changes
 * path - Path for current page of form
 * rows - Array of data for this component
 * isValidSection - Function to check if the current page is valid
 * addNewMessage - Message displayed at the top of new rows in editing mode
 * rowTitle - Title used for Update button text
 * alwaysShowUpdateRemoveButtons (default: false) - Always show the Update/Remove buttons, instead of hiding them on first row
 * showSingleRowExpanded (default: true) - Show table in editing mode if only one row
 * showEditButton (default: true) - Show edit button in collapsed view
 * showAddAnotherButton (default: true) - Show the add another button at the bottom of the table
 * createRowIfEmpty (default: true) - If rows prop is empty, create an empty row as a placeholder
*/

class GrowableTable extends React.Component {
  constructor(props) {
    super(props);
    this.createNewElement = this.createNewElement.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.scrollToFirstError = this.scrollToFirstError.bind(this);
    this.getRowId = this.getRowId.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.tableId = _.uniqueId('growable-table');
    if (this.props.rows.length > 0) {
      this.props.rows.map((obj) => {
        this.setState({ [obj.key]: 'complete' });
        return true;
      });
    }
  }
  componentDidMount() {
    if (this.props.createRowIfEmpty && this.props.rows.length === 0) {
      this.createNewElement();
    }
  }
  componentWillReceiveProps(newProps) {
    // We might have a new row added externally, so make sure it gets into local state
    newProps.rows.forEach(row => {
      if (!row.key) {
        row.key = _.uniqueId('key-'); // eslint-disable-line no-param-reassign
        this.setState({ [row.key]: 'incomplete' });
        this.scrollToRow(row.key);
      }
    });
  }

  getRowId(key) {
    return `table${this.tableId}Row${key}`;
  }

  scrollToFirstError(key) {
    setTimeout(() => {
      const errorEl = document.querySelector(`#${this.getRowId(key)} .usa-input-error, #${this.getRowId(key)} .input-error-date`);
      if (errorEl) {
        scrollAndFocus(errorEl);
      }
    }, 100);
  }

  scrollToTop() {
    const options = getScrollOptions({ offset: -60 });
    setTimeout(() => {
      scroller.scrollTo(`topOfTable${this.tableId}`, options);
    }, 100);
  }

  scrollToRow(key) {
    setTimeout(() => {
      scroller.scrollTo(this.getRowId(key), getScrollOptions());
    }, 100);
  }
  createNewElement() {
    const blankRowData = this.props.createRow();
    blankRowData.key = _.uniqueId('key-');
    const rows = this.props.rows.slice();
    rows.push(blankRowData);
    this.props.onRowsUpdate(rows);

    this.setState({ [blankRowData.key]: 'incomplete' });

    return blankRowData.key;
  }

  findIncomplete() {
    return _.findKey(this.state, v => v === 'incomplete');
  }

  handleAdd() {
    // Save existing
    const success = this.handleSave();

    if (success) {
      const key = this.createNewElement();
      this.scrollToRow(key);
    }
  }

  handleEdit(key) {
    this.setState({ [key]: 'edit' });
    this.scrollToRow(key);
  }

  handleSave(event, index) {
    const key = event ? event.target.dataset.key : this.findIncomplete();
    const rowIndex = index !== undefined ? index : (this.props.rows.length - 1);

    let success = true;

    if (rowIndex !== undefined && this.props.isValidRow && this.props.isValidRow(this.props.rows[rowIndex])) {
      this.setState({ [key]: 'complete' });
      this.scrollToTop();
    } else if (this.props.isValidSection && this.props.isValidSection(this.props.path, this.props.data)) {
      this.setState({ [key]: 'complete' });
      this.scrollToTop();
    } else {
      this.props.initializeCurrentElement();
      success = false;
      this.scrollToFirstError(key);
    }


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
    const collapseRows = !this.props.showSingleRowExpanded || this.props.rows.length > 1;

    const rowElements = this.props.rows.map((obj, index) => {
      const stateKey = state[obj.key];
      if (stateKey && stateKey === 'complete' && collapseRows) {
        const collapsedComponent = React.createElement(this.props.component,
          { data: obj,
            view: 'collapsed',
            onEdit: () => this.handleEdit(obj.key),
            onValueChange: (subfield, update) => {
              const newRows = set(`[${index}].${subfield}`, update, this.props.rows);
              this.props.onRowsUpdate(newRows);
            }
          });
        rowContent = (
          <div key={reactKey++} className="va-growable-background">
            <Element name={this.getRowId(obj.key)}/>
            {this.props.showEditButton
              ? <div className="row small-collapse" key={obj.key}>
                <div className="small-9 columns">
                  {collapsedComponent}
                </div>
                <div className="small-3 columns">
                  <button className="usa-button-outline float-right" onClick={() => this.handleEdit(obj.key)} data-key={obj.key}>Edit</button>
                </div>
              </div>
              : collapsedComponent}
          </div>
        );
      } else {
        let buttons;
        if (collapseRows) {
          buttons = (
            <div className="row small-collapse">
              {stateKey !== 'incomplete' || this.props.alwaysShowUpdateRemoveButtons
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
          <div key={reactKey++} className={(stateKey === 'edit' || collapseRows) ? 'va-growable-background' : null} id={this.getRowId(obj.key)}>
            <Element name={`table${this.tableId}Row${obj.key}`}/>
            <div className="row small-collapse" key={obj.key}>
              <div className="small-12 columns va-growable-expanded">
                {(stateKey === 'incomplete' && this.props.rowTitle && this.props.rows.length > 1)
                    ? <h5>{this.props.rowTitle}</h5>
                    : null}
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
        <Element name={`topOfTable${this.tableId}`}/>
        {rowElements}
        {this.props.showAddAnotherButton && <button className="usa-button-outline va-growable-add-btn" onClick={this.handleAdd}>{this.props.addNewMessage || 'Add Another'}</button>}
      </div>
    );
  }
}

GrowableTable.propTypes = {
  component: PropTypes.func.isRequired,
  createRow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeCurrentElement: PropTypes.func.isRequired,
  onRowsUpdate: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  isValidSection: PropTypes.func.isRequired,
  addNewMessage: PropTypes.string,
  rowTitle: PropTypes.string,
  alwaysShowUpdateRemoveButtons: PropTypes.bool,
  showSingleRowExpanded: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showAddAnotherButton: PropTypes.bool,
  createRowIfEmpty: PropTypes.bool
};

GrowableTable.defaultProps = {
  alwaysShowUpdateRemoveButtons: false,
  showEditButton: true,
  showSingleRowExpanded: true,
  showAddAnotherButton: true,
  createRowIfEmpty: true
};

export default GrowableTable;
