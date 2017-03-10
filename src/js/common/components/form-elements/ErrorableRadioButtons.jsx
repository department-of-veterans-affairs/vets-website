import React from 'react';
import _ from 'lodash';

import ToolTip from './ToolTip';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';

import { makeField } from '../../model/fields.js';

/**
 * A radio button group with a label.
 *
 * Validation has the following props.

 * `label` - String for the group field label.
 * `name` - String for the name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `options` - Array of options to populate group.
 * `required` - is this field required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableRadioButtons extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.getMatchingSubSection = this.getMatchingSubSection.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-radio-buttons-');
  }

  getMatchingSubSection(checked, optionValue) {
    if (checked && this.props.children) {
      const children = _.isArray(this.props.children) ? this.props.children : [this.props.children];
      const subsections = children.filter((child) => child.props.showIfValueChosen === optionValue);
      return subsections.length > 0 ? subsections[0] : null;
    }

    return null;
  }

  handleChange(domEvent) {
    this.props.onValueChange(makeField(domEvent.target.value, true));
  }

  render() {
    // TODO: extract error logic into a utility function
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
    }

    // Addes ToolTip if text is provided.
    let toolTip;
    if (this.props.toolTipText) {
      toolTip = (
        <ToolTip
            tabIndex={this.props.tabIndex}
            toolTipText={this.props.toolTipText}/>
      );
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">*</span>;
    }

    const options = _.isArray(this.props.options) ? this.props.options : [];
    const storedValue = this.props.value.value;
    const optionElements = options.map((obj, index) => {
      let optionLabel;
      let optionValue;
      let optionAdditional;
      if (_.isString(obj)) {
        optionLabel = obj;
        optionValue = obj;
      } else {
        optionLabel = obj.label;
        optionValue = obj.value;
        if (obj.additional) {
          optionAdditional = (<div>{obj.additional}</div>);
        }
      }
      const checked = optionValue === storedValue ? 'checked=true' : '';
      const matchingSubSection = this.getMatchingSubSection(optionValue === storedValue, optionValue);
      const radioButton = (
        <div key={optionAdditional ? undefined : index} className="form-radio-buttons">
          <input
              autoComplete="false"
              checked={checked}
              id={`${this.inputId}-${index}`}
              name={`${this.props.name}-${index}`}
              type="radio"
              value={optionValue}
              onChange={this.handleChange}/>
          <label
              name={`${this.props.name}-${index}-label`}
              htmlFor={`${this.inputId}-${index}`}>
            {optionLabel}
          </label>
          {matchingSubSection}
        </div>
      );

      let output = radioButton;

      // Return an expanding group for buttons with additional content
      if (optionAdditional) {
        output = (
          <ExpandingGroup
              additionalClass="form-expanding-group-active-radio"
              open={checked}
              key={index}>
            {radioButton}
            <div>{optionAdditional}</div>
          </ExpandingGroup>
        );
      }

      return output;
    });

    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : ''}>
        <label
            className={this.props.errorMessage ? 'usa-input-error-label' : undefined}
            htmlFor={this.inputId}>
            {this.props.label}
            {requiredSpan}
        </label>
        {errorSpan}
        {optionElements}
        {toolTip}
      </div>
    );
  }
}

ErrorableRadioButtons.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.element,
        ]),
        value: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.bool
        ]),
        additional: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.element
        ])
      })
    ])).isRequired,
  value: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool,
};

export default ErrorableRadioButtons;
