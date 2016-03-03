import React from 'react';
import _ from 'lodash';

/**
 * A component for the continue button to navigate through panels of questions.
 *
 * Required props
 * `onButtonClick`: function that changes the path to the next panel
 */
class ContinueButton extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    return (
      <div className="row progress-buttons">
        <div className="small-8 columns">
          <button
              className="usa-button-primary"
              id={`${this.id}-continueButton`}
              onClick={this.props.onButtonClick}>Continue</button>
        </div>
      </div>
    );
  }
}

ContinueButton.propTypes = {
  onButtonClick: React.PropTypes.func.isRequired
};

export default ContinueButton;
