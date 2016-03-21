import React from 'react';
import _ from 'lodash';

/**
 * A component for the continue button to navigate through panels of questions.
 *
 * Required props
 * `onButtonClick`: function that changes the path to the next panel or submit.
 * `buttonText`: String. Stores the value for the button text.
 * `buttonClass`: String. Stores the value for the button class(es).
 */

class ProgressButton extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    return (
      <div className="row progress-buttons">
        <div className="small-8 columns">
          <button
              className={`text-capitalize ${this.props.buttonClass}`}
              id={`${this.id}-continueButton`}
              onClick={this.props.onButtonClick}>{this.props.buttonText}</button>
        </div>
      </div>
    );
  }
}

ProgressButton.propTypes = {
  onButtonClick: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  buttonClass: React.PropTypes.string.isRequired
};

export default ProgressButton;
