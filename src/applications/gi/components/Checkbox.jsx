import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { SMALL_SCREEN_WIDTH } from '../constants';
import { handleScrollOnInputFocus } from '../utils/helpers';
import environment from 'platform/utilities/environment';

/**
 * A form checkbox with a label that can display error messages.
 *
 * Validation has the following props.
 * `checked` - Boolean. Whether or not the checkbox is checked.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates checkbox has a validation error.
 * `label` - String for the checkbox label.
 * `name` - String for name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `onValueChange` - a function with this prototype: (newValue)
 * `required` - boolean. Render marker indicating field is required.
 */
class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.inputId = _.uniqueId('errorable-checkbox-');
  }

  handleFocus = e => {
    // prod flag for bah-8821
    if (environment.isProduction()) {
      if (window.innerWidth <= SMALL_SCREEN_WIDTH) {
        e.target.scrollIntoView();
      }
    } else {
      this.props.onFocus(e);
    }
  };

  render() {
    // TODO: extract error logic into a utility function
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    const hasErrors = !!this.props.errorMessage;
    if (hasErrors) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {this.props.errorMessage}
        </span>
      );
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">*</span>;
    }

    let className = `form-checkbox${hasErrors ? ' usa-input-error' : ''}`;
    if (!_.isUndefined(this.props.className)) {
      className = `${className} ${this.props.className}`;
    }
    return (
      <div className={className}>
        <input
          aria-describedby={errorSpanId}
          checked={this.props.checked}
          id={this.props.id || this.inputId}
          name={this.props.name}
          type="checkbox"
          onChange={this.props.onChange}
          onFocus={this.handleFocus}
        />
        <label
          className={classNames('gi-checkbox-label', {
            'usa-input-error-label': hasErrors,
          })}
          name={`${this.props.name}-label`}
          htmlFor={this.inputId}
        >
          {this.props.label}
          {requiredSpan}
        </label>
        {errorSpan}
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  errorMessage: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  onFocus: PropTypes.func,
};

Checkbox.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default Checkbox;
