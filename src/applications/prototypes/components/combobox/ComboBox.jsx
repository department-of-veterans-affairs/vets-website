/* eslint-disable */
// eslint-disable-next-line max-classes-per-file
import { Component, createRef } from 'react';
import { connect } from 'react-redux';

//import './BasicCombobox.scss';
import './combo-box.scss';
// import './formation-readded.css';
//import 'uswds/src/stylesheets/components/_combo-box.scss';
import React from "react";
import { getDisabilityLabels } from '../../../disability-benefits/all-claims/content/disabilityLabels';
import { substringCountLCS } from './search';
import { initialState } from './reducer';
import {
  ADD_ITEM,
  UPDATE_CURRENT,
  DELETE_ITEM,
  UPDATE_ITEM,
  SHOW_NEW_CONDITION_SECTION,
  HIDE_NEW_CONDITION_SECTION,
} from './actions';

const MAX_NUM_DISABILITY_SUGGESTIONS = 20;
const DISABILITIES_OBJECT = getDisabilityLabels();
const COMBOBOX_LIST_MAX_HEIGHT = '440px';

// actions
const addItem = (item) => ({ type: ADD_ITEM, payload: item });
const updateCurrent = (current) => ({ type: UPDATE_CURRENT, payload: current });
const deleteItem = (id) => ({ type: DELETE_ITEM, payload: { id } });
const updateItem = (item) => ({ type: UPDATE_ITEM, payload: item });
const showNewConditionSection = () => ({ type: SHOW_NEW_CONDITION_SECTION });
const hideNewConditionSection = () => ({ type: HIDE_NEW_CONDITION_SECTION });

class ComboBox extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.disabilitiesArr = Object.values(DISABILITIES_OBJECT);
    this.listRef = createRef();
    this.state = {
      searchTerm: value || '',
      filteredOptions: [],
      value: value || '',
      // highlightedIndex: -2, // New state to track the highlighted option index
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.filterOptions();
    }
    if (prevState.value !== '' && this.state.value === '') {
      this.setState({ searchTerm: '' })
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleCliccyBoi);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleCliccyBoi);
  }

  handleCliccyBoi = (evt) => {
    const isClickedInComboBox = evt.composedPath().includes(this.listRef.current)
    
    if (!isClickedInComboBox) {
      console.log('clicked outside of combobox');
      console.log('clicked outside of combobox');
      console.log('clicked outside of combobox');
      console.log('clicked outside of combobox');
      console.log('clicked outside of combobox');
      this.setState({ searchTerm: '' });
    }
  }

  handleKeyDownFromInput(evt) {
    switch (evt.key) {
      case 'Tab':
      case 'ArrowDown':
      case 'ArrowUp':
        const liElem = this.listRef.current.querySelector('.usa-combo-box__list-option');
        liElem.focus();
        evt.preventDefault();
        break;

      case 'Enter':
        this.setState({ searchTerm: '' });
        evt.preventDefault();
        break;
      case 'Escape':
        this.setState({ searchTerm: '' });
        evt.preventDefault();
        break;

      default:
        break;
    }
  }

  handleKeyDownFromLi(evt, option) {
    console.log('key from li: ', evt.key);
    switch (evt.key) {
      case 'ArrowDown':
        evt.preventDefault();
        const focusedOptionEl = evt.target;
        const nextOptionEl = focusedOptionEl.nextSibling;

        if (nextOptionEl) {
          nextOptionEl.focus();
          // nextOptionEl.classList.add('usa-combo-box-highlight');
        }
        else {
          this.setState({ searchTerm: '' });
        }
        break;
      case 'ArrowUp':
        evt.preventDefault();
        const focusedOptionElUpArrow = evt.target;
        const prevOptionEl = focusedOptionElUpArrow.previousSibling;

        if (prevOptionEl) {
          prevOptionEl.focus();
        }
        else {
          this.setState({ searchTerm: '' });
        }
        break;
      case 'Enter':
        this.selectOption(option);
        break;
      case 'Tab':
        this.setState({ searchTerm: '' });
        break;
      default:
        console.log('default');
        break;
    }
  }

  handleMouseEnter(evt, option) {
    const newFocusedElem = evt.target;
    newFocusedElem.focus();
  }

  handleBlur(evt) {
    console.log('blur event: ', evt);
    console.log('evt.relatedTarget: ', evt.relatedTarget);
    const blurTarget = evt.relatedTarget;
    if (blurTarget && blurTarget.classList.contains('free-text-li-option')) {
      console.log('nothing happens');
    }
    else {
      this.setState({ searchTerm: '' });
    }
  }

  filterOptions = () => {
    const { searchTerm, value } = this.state;
    const options = this.disabilitiesArr;
    let filtered = substringCountLCS(searchTerm, options, 0)
    filtered = filtered.splice(0, MAX_NUM_DISABILITY_SUGGESTIONS);
    if (searchTerm && searchTerm.length === 0) {
      filtered = [];
    }
    if (searchTerm == value) {
      filtered = [];
    }
    this.setState({ filteredOptions: filtered });
  };

  handleSearchChange = (e) => {
    const updatedTerm = e.target.value;
    this.setState({ searchTerm: updatedTerm });
  };

  handleClearTextEntry = () => {
    this.setState({
      searchTerm: '',
      value: '',
    });
  }

  drawCloseButton() {
    return (
      <span class="usa-combo-box__clear-input__wrapper" tabindex="-1">
        <button type="button" class="usa-combo-box__clear-input" aria-label="Clear the select contents" onClick={() => { this.handleClearTextEntry() }}>&nbsp;</button>
      </span>
    )
  }

  drawFreeTextOption(option) {
    const liText = `Add "${option}" as a new condition`;
    return (
      <li 
       key={-1}
       className="usa-combo-box__list-option free-text-li-option"
       onKeyDown={(evt) => { this.handleKeyDownFromLi(evt, option) }}
       onClick={() => { this.selectOption(option) }}
       style={{ cursor: 'pointer' }}
       tabIndex="-1"
       onMouseEnter={(evt) => { this.handleMouseEnter(evt, option) }}
       label="new-condition-option"
      >
        Add "<span style={{ fontWeight: 'bold' }}>{option}</span>" as a new condition
      </li>
    )
  }

  selectOption(option) {
    this.setState({
      value: option,
      searchTerm: option,
      filteredOptions: [],
    });
    const { onChange } = this.props;
    onChange(option);
  }

  highlightOptionWithSearch(option, searchInput) {
    option = option.toLowerCase();
    const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const value = searchInput.toLowerCase();
    const caseInsensitiveMatch = new RegExp(`(${escapeRegExp(value)})`, "i");
    let highlightedText = option
      .split(caseInsensitiveMatch)
      .map((str) =>
        str.toLowerCase() === searchInput
          ? `<span style="font-weight: bold">${str}</span>`
          : str
      )
      .join("");
    return (<div dangerouslySetInnerHTML={{ __html: highlightedText }} />);
  }

  render() {
    const { searchTerm, filteredOptions, value } = this.state;

    return (
      <div className="usa-combo-box prototype-combobox-class" data-enhanced="true">
        <input
          type="text"
          className={'usa-combo-box__input'}
          placeholder=""
          value={searchTerm}
          onChange={this.handleSearchChange}
          onKeyDown={(evt) => { this.handleKeyDownFromInput(evt) }}
          // onBlur={(evt) => { this.handleBlur(evt) }}
        />
        { searchTerm.length || value.length ? this.drawCloseButton() : null }
        <ul className={'usa-combo-box__list'} style={{ maxHeight: COMBOBOX_LIST_MAX_HEIGHT }} ref={this.listRef}>
          {searchTerm.length && searchTerm !== value ? this.drawFreeTextOption(searchTerm) : null}
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="usa-combo-box__list-option"
              onKeyDown={(evt) => { this.handleKeyDownFromLi(evt, option) }}
              onClick={() => { this.selectOption(option) }}
              style={{ cursor: 'pointer' }}
              tabIndex="-1"
              onMouseEnter={(evt) => { this.handleMouseEnter(evt, option) }}
              label={option}
            >
              {this.highlightOptionWithSearch(option, searchTerm)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export const ComboBoxApp = connect(state => state)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = { editMode: 0 };
      this.handleAdd = this.handleAdd.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleEditMode = this.handleEditMode.bind(this);
      this.handleEdit = this.handleEdit.bind(this);
    }

    // save button clicked
    handleAdd() {
      const { name } = this.props.current;
      if (name) {
        this.itemId = (this.itemId || 0) + 1;

        this.props.dispatch(addItem({ id: this.itemId, name }));
        this.props.dispatch(updateCurrent(initialState.current));
        this.props.dispatch(hideNewConditionSection());
      }
    }

    handleDelete(evt) {
      this.props.dispatch(deleteItem(Number(evt.target.value)));
      this.props.dispatch(updateCurrent(initialState.current)); // Reset the current item
      this.setState({ editMode: 0 }); // Exit edit mode if we're in it
    }
    handleCloseNewConditionSection() {
      this.props.dispatch(hideNewConditionSection());
    }

    handleChange(obj) {
      console.log("***handleChange");
      console.log(obj);
      this.props.dispatch(updateCurrent(obj));
    }

    handleEditMode(evt) {
      console.log('handleEditMode called with event', evt);
      const { isAddingNewCondition } = this.props;
      if (isAddingNewCondition) {
        this.props.dispatch(hideNewConditionSection());
      }
      this.setState({ editMode: Number(evt.target.value) });
      this.props.dispatch(updateCurrent(this.props.list.find(item => item.id === +evt.target.value)));
    }

    handleEdit() {
      console.log('this', this)
      const { name } = this.props.current;

      console.log("***handleEdit");

      console.log("updated name: " + name + "this.state.editMode: " + this.state.editMode);

      console.log("----> Props");
      console.log(this.props);
      if (name) {
        this.props.dispatch(updateItem({ id: this.state.editMode, name }));
        this.props.dispatch(updateCurrent(initialState.current));
        this.setState({ editMode: 0 });
      }
    }
    showAddNewConditionSection() {
      const { isAddingNewCondition } = this.props;
      if (!isAddingNewCondition) {
        this.setState({ editMode: 0 });
        this.props.dispatch(updateCurrent(initialState.current)); // Reset the current item
      }
      this.props.dispatch(showNewConditionSection());
    }

    render() {
      const { current, list, isAddingNewCondition } = this.props;

      return (
        <div id="addedDisabilities" class="va-growable vads-u-margin-top--2">
          <div name="topOfTable_root_newDisabilities"></div>
          {list.map(item =>
            <div class="va-growable-background" id={"condition" + item.id} key={item.id}>
              {this.state.editMode !== item.id ?
                /* This is how the form displays in non-edit mode */
                <div class="row small-collapse vads-u-display--flex vads-u-align-items--center">
                  <div class="vads-u-flex--fill vads-u-padding-right--2 word-break capitalize-first"
                    id={"disabilityName_" + item.id}
                  >
                    {item.name}
                  </div>
                  <button type="button" class="usa-button-secondary float-right" aria-label={"Edit " + current.name} value={item.id} onClick={this.handleEditMode}>Edit</button>
                </div> :
                /* This is how the form displays in edit mode */
                <div id="addNewConditionSection">
                  <div name="table_root_newDisabilities_1"></div>
                  <div class="row small-collapse">
                    <fieldset class="small-12 columns va-growable-expanded word-break">
                      <legend class="vads-u-font-size--base">Type to find your condition<span class="schemaform-required-span vads-u-font-weight--normal" style={{ color: 'rgb(181, 9, 9)' }}> (*Required)</span></legend>
                      <div class="input-section">
                        <div class="vads-u-margin-y--2 rjsf-object-field">
                          <div>
                            <div class="schemaform-field-template schemaform-first-field">
                              <label id="root_newDisabilities_1_condition-label" class="schemaform-label" for="root_newDisabilities_1_condition">
                              </label>
                              <div class="schemaform-widget-wrapper">
                                <div class="autosuggest-container">
                                  {/* This is where we want to embed the new Combo-Box*/}

                                  {/* <ComboBox value={current.name}/> */}
                                  {/* onChange={(value) => this.handleChange({name: value})}
 */}
                                  <ComboBox
                                    value={current.name}
                                    onChange={(value) => this.handleChange({ name: value })}

                                  />



                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row small-collapse">
                        <div class="small-6 left columns">
                          <button type="button" class="float-left" aria-label="Save Condition" className="btn" onClick={this.handleEdit}>Update</button>
                          <div class="float-left row columns"></div>
                        </div>
                        {/* TODO: Add Remove Action */}
                        <div class="small-6 right columns">{list.length > 1 ? <button type="button" class="usa-button-secondary float-right" aria-label="Remove incomplete Condition" value={item.id} onClick={this.handleDelete}>Remove</button> : null}</div>
                      </div>
                    </fieldset>
                  </div>
                </div>

              }


            </div>
          )}

          {/* This is the section that we need to show first and hide after adding the first condition. Show only if the user clicks on "Add another condition button" */}
          {isAddingNewCondition && (
            <div id="addNewConditionSection" class="va-growable-background">
              <div name="table_root_newDisabilities_1"></div>
              <div class="row small-collapse">
                <fieldset class="small-12 columns va-growable-expanded word-break">
                  <legend class="vads-u-font-size--base">Type to find your condition<span class="schemaform-required-span vads-u-font-weight--normal" style={{ color: 'rgb(181, 9, 9)' }}> (*Required)</span></legend>
                  <div class="input-section">
                    <div class="vads-u-margin-y--2 rjsf-object-field">
                      <div>
                        <div class="schemaform-field-template schemaform-first-field">
                          <label id="root_newDisabilities_1_condition-label" class="schemaform-label" for="root_newDisabilities_1_condition">
                          </label>
                          <div class="schemaform-widget-wrapper">
                            <div class="autosuggest-container">
                              {/* This is where we want to embed the new Combo-Box*/}
                              {/* attr={{ disabled: this.state.editMode }} */}
                              {/* onChange={(value) => this.handleChange({ name: value })} */}
                              {/*  */}
                              <ComboBox
                                value={this.state.editMode ? '' : current.name}
                                onChange={(value) => this.handleChange({ name: value })}
                              />

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row small-collapse">
                    <div class="small-6 left columns">
                      <button type="button" class="float-left" aria-label="Save Condition"
                        disabled={this.state.editMode} onClick={this.handleAdd}>Save</button>
                      <div class="float-left row columns"></div>
                    </div>
                    {/* TODO: Add Remove/Hide button when no conditions are added */}

                    {
                      this.props.list.length > 0 ?
                        <div class="small-6 right columns"><button id="removeNewConditionButton" type="button" class="usa-button-secondary float-right" aria-label="Remove incomplete Condition" onClick={() => {this.handleCloseNewConditionSection()}}>Remove</button>

                        </div> :
                        <div></div>
                    }
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* <button id="addNewConditionButton" type="button" class="usa-button-secondary va-growable-add-btn" onclick="showAddNewConditionSection()">Add another condition</button>
            </div> */}
          <button id="addNewConditionButton" type="button" class="usa-button-secondary va-growable-add-btn" onClick={() => { this.showAddNewConditionSection() }}>Add another condition</button>
        </div>

      );
    }
  },
);
