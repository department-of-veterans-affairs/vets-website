import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import ToolTip from './ToolTip';
import ExpandingGroup from '@department-of-veterans-affairs/formation-react/ExpandingGroup';
import { handleInputFocus } from '../utils/helpers';

/**
 * A radio button group with a label.
 *
 * `label` - String for the group field label.
 * `name` - String for the name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `options` - Array of options to populate group.
 * `required` - is this field required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.inputId = _.uniqueId('radio-buttons-');
  }

  handleChange = domEvent => {
    this.props.onChange(domEvent);
  };

  renderOptions = () => {
    const options = _.isArray(this.props.options) ? this.props.options : [];
    const storedValue = this.props.value;
    return options.map((obj, index) => {
      let optionLabel;
      let optionValue;
      let optionAdditional;
      let learnMore;
      if (_.isString(obj)) {
        optionLabel = obj;
        optionValue = obj;
      } else {
        optionLabel = obj.label;
        optionValue = obj.value;
        if (obj.additional) {
          optionAdditional = <div>{obj.additional}</div>;
        }
        if (obj.learnMore) {
          learnMore = obj.learnMore;
        }
      }
      const checked = optionValue === storedValue ? 'checked=true' : '';
      const inputId = `${this.inputId}-${index}`;
      const labelId = `${inputId}-label`;
      const radioButton = (
        <div
          key={optionAdditional ? undefined : index}
          className="form-radio-buttons gids-radio-buttons"
        >
          <input
            className="gids-radio-buttons-input"
            checked={checked}
            id={inputId}
            name={this.props.name}
            type="radio"
            value={optionValue}
            onChange={this.handleChange}
            onFocus={handleInputFocus.bind(this, `${this.inputId}-legend`)}
            aria-labelledby={`${this.inputId}-legend ${labelId}`}
          />
          <label
            id={labelId}
            name={`${this.props.name}-${index}-label`}
            htmlFor={inputId}
            className="vads-u-margin-top--1 vads-u-margin-bottom--1"
          >
            {optionLabel}
          </label>
          {learnMore}
        </div>
      );

      let output = radioButton;

      // Return an expanding group for buttons with additional content
      if (optionAdditional) {
        output = (
          <ExpandingGroup
            additionalClass="form-expanding-group-active-radio"
            open={checked}
            key={index}
          >
            {radioButton}
            <div>{optionAdditional}</div>
          </ExpandingGroup>
        );
      }

      return output;
    });
  };

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

    // Addes ToolTip if text is provided.
    let toolTip;
    if (this.props.toolTipText) {
      toolTip = (
        <ToolTip
          tabIndex={this.props.tabIndex}
          toolTipText={this.props.toolTipText}
        />
      );
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">*</span>;
    }

    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : ''}>
        <fieldset>
          <div>
            <span
              id={`${this.inputId}-legend`}
              className={
                this.props.errorMessage
                  ? 'usa-input-error-label'
                  : 'gibct-legend'
              }
            >
              {this.props.label}
              {requiredSpan}
            </span>
            {errorSpan}
            {this.renderOptions()}
            {toolTip}
          </div>
        </fieldset>
      </div>
    );
  }
}

RadioButtons.propTypes = {
  errorMessage: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        additional: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        learnMore: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      }),
    ]),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default RadioButtons;
