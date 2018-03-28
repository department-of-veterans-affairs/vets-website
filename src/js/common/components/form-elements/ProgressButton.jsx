import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';

/*
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

/**
 * A component for the continue button to navigate through panels of questions.
 *
 * Required props
 * `onButtonClick`: function that changes the path to the next panel or submit.
 * `buttonText`: String. Stores the value for the button text.
 * `buttonClass`: String. Stores the value for the button class(es).
 * `beforeText`: String. Stores the value for the icon that will appear before the button text.
 * `afterText`: String. Stores the value for the icon that will appear after the button text.
 */

/*
class ProgressButton extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    const beforeText = (this.props.beforeText) ? (<span className="button-icon">{this.props.beforeText} </span>) : '';
    const afterText = (this.props.afterText) ? (<span className="button-icon"> {this.props.afterText}</span>) : '';

    return (
      <button
        type={this.props.submitButton ? 'submit' : 'button'}
        disabled={this.props.disabled}
        className={`${this.props.buttonClass} ${this.props.disabled ? 'usa-button-disabled' : null}`}
        id={`${this.id}-continueButton`}
        onClick={this.props.onButtonClick}>{beforeText}{this.props.buttonText}{afterText}</button>
    );
  }
}

ProgressButton.propTypes = {
  onButtonClick: PropTypes.func,
  buttonText: PropTypes.string.isRequired,
  buttonClass: PropTypes.string.isRequired,
  beforeText: PropTypes.string,
  afterText: PropTypes.string,
  disabled: PropTypes.bool,
  submitButton: PropTypes.bool
};

*/
export default ProgressButton;
