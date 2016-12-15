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

class ProgressButton extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    const beforeText = (this.props.beforeText) ? (<span className="button-icon">{this.props.beforeText} </span>) : '';
    const afterText = (this.props.afterText) ? (<span className="button-icon"> {this.props.afterText}</span>) : '';

    return (
      <button
          disabled={this.props.disabled}
          className={`text-capitalize ${this.props.buttonClass} ${this.props.disabled ? 'usa-button-disabled' : null}`}
          id={`${this.id}-continueButton`}
          onClick={this.props.onButtonClick}>{beforeText}{this.props.buttonText}{afterText}</button>
    );
  }
}

ProgressButton.propTypes = {
  onButtonClick: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  buttonClass: React.PropTypes.string.isRequired,
  beforeText: React.PropTypes.string,
  afterText: React.PropTypes.string,
  disabled: React.PropTypes.bool
};

export default ProgressButton;
