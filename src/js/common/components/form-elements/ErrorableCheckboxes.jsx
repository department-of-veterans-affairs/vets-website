import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import ToolTip from './ToolTip';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';

import { makeField } from '../../model/fields.js';

/**
 * A checkbox button group with a label.
 *
 * Validation has the following props.

 * `additionalFieldsetClass` - String for any additional fieldset classes.
 * `additionalLegendClass` - String for any additional legend classes.
 * `label` - String for the group field label.
 * `name` - String for the name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `options` - Array of options to populate group.
 * `required` - is this field required.
 * `values` - object. Values of the checkbox field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableCheckboxes extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.getMatchingSubSection = this.getMatchingSubSection.bind(this);
  }

  componentWillMount() {
    this.inputId = this.props.id || _.uniqueId('errorable-checkbox-buttons-');
  }

  getMatchingSubSection(checked, optionValues) {
    if (checked && this.props.children) {
      const children = _.isArray(this.props.children) ? this.props.children : [this.props.children];
      const subsections = children.filter((child) => optionValues.contains(child.props.showIfValueChosen));
      return subsections.length > 0 ? subsections[0] : null;
    }

    return null;
  }

  handleChange(domEvent) {
    this.props.onValueChange(makeField(domEvent.target.value, true), domEvent.target.checked);
  }

  render() {
    // TODO: extract error logic into a utility function
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {this.props.errorMessage}
        </span>
      );
    }

    // Adds ToolTip if text is provided.
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
    const storedValues = this.props.values;
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
      const checked = storedValues[optionValue] ? 'checked=true' : '';
      const matchingSubSection = this.getMatchingSubSection(checked, optionValue);
      const checkboxButton = (
        <div key={optionAdditional ? undefined : index} className="form-checkbox-buttons">
          <input
            autoComplete="false"
            checked={checked}
            id={`${this.inputId}-${index}`}
            name={this.props.name}
            type="checkbox"
            onMouseDown={this.props.onMouseDown}
            onKeyDown={this.props.onKeyDown}
            value={optionValue}
            onChange={this.handleChange}/>
          <label
            name={`${this.props.name}-${index}-label`}
            htmlFor={`${this.inputId}-${index}`}>
            {optionLabel}
          </label>
          {matchingSubSection}
          {obj.content}
        </div>
      );

      let output = checkboxButton;

      // Return an expanding group for buttons with additional content
      if (optionAdditional) {
        output = (
          <ExpandingGroup
            additionalClass="form-expanding-group-active-checkbox"
            open={checked}
            key={index}>
            {checkboxButton}
            <div>{optionAdditional}</div>
          </ExpandingGroup>
        );
      }

      return output;
    });

    const fieldsetClass = classNames('fieldset-input', {
      'usa-input-error': this.props.errorMessage,
      [this.props.additionalFieldsetClass]: this.props.additionalFieldsetClass
    });

    const legendClass = classNames('legend-label', {
      'usa-input-error-label': this.props.errorMessage,
      [this.props.additionalLegendClass]: this.props.additionalLegendClass
    });

    return (
      <fieldset className={fieldsetClass}>
        <legend
          className={legendClass}>
          {this.props.label}
          {requiredSpan}
        </legend>
        {errorSpan}
        {optionElements}
        {toolTip}
      </fieldset>
    );
  }
}

ErrorableCheckboxes.propTypes = {
  additionalFieldsetClass: PropTypes.string,
  additionalLegendClass: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
        ]),
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.bool
        ]),
        content: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element
        ]),
        additional: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element
        ])
      })
    ])).isRequired,
  values: PropTypes.object.isRequired,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onValueChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default ErrorableCheckboxes;
