import PropTypes from 'prop-types';
import React from 'react';
import uniqueId from 'lodash/uniqueId';

/**
 * A component for the continue button to navigate through panels of questions.
 */

class ProgressButton extends React.Component {
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    this.id = uniqueId();
  }

  render() {
    let beforeText = '';

    if (this.props.beforeText && this.props.beforeText === '«') {
      beforeText = (
        <va-icon icon="navigate_far_before" class="vads-u-padding-right--1" />
      );
    } else if (this.props.beforeText) {
      beforeText = (
        <span className="button-icon" aria-hidden="true">
          {this.props.beforeText}
          &nbsp;
        </span>
      );
    }

    let afterText = '';

    if (this.props.afterText && this.props.afterText === '»') {
      afterText = (
        <va-icon icon="navigate_far_next" class="vads-u-padding-left--1" />
      );
    } else if (this.props.afterText) {
      afterText = (
        <span className="button-icon" aria-hidden="true">
          &nbsp;
          {this.props.afterText}
        </span>
      );
    }

    return (
      // aria-describedby tag to match "By submitting this form"
      // text for proper screen reader operation
      <button
        type={this.props.submitButton ? 'submit' : 'button'}
        disabled={this.props.disabled}
        className={`${this.props.buttonClass}${
          this.props.disabled ? ' usa-button-disabled' : ''
        }`}
        id={`${this.id}-continueButton`}
        onClick={this.props.onButtonClick}
        onMouseDown={this.props.preventOnBlur}
        aria-label={this.props.ariaLabel || null}
        aria-describedby={this.props.ariaDescribedBy}
      >
        {beforeText}
        {this.props.buttonText}
        {afterText}
      </button>
    );
  }
}

ProgressButton.defaultProps = {
  preventOnBlur: e => {
    e.preventDefault();
  },
};

ProgressButton.propTypes = {
  // function that changes the path to the next panel or submit.
  onButtonClick: PropTypes.func,

  // function that bypasses onBlur when clicking
  preventOnBlur: PropTypes.func,

  // what is the button's label
  buttonText: PropTypes.string.isRequired,

  // what CSS class(es) does the button have
  buttonClass: PropTypes.string.isRequired,

  // Stores the value for the icon that will appear before the button text.
  beforeText: PropTypes.string,

  // Stores the value for the icon that will appear after the button text.
  afterText: PropTypes.string,

  // is the button disabled or not
  disabled: PropTypes.bool,

  // aria-label attribute; needed for the review & submit page "Update page"
  // button
  ariaLabel: PropTypes.string,

  // is this a submit button or not
  submitButton: PropTypes.bool,
};

export default ProgressButton;
