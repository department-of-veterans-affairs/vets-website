import React from 'react';
import _ from 'lodash';

/**
 * A component to submit the form.
 *
 * Required props
 * `onButtonClick`: function that submits the form data.
 */
class SubmitButton extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    return (
      <div className="row progress-buttons">
        <div className="small-8 columns">
          <button
              className="usa-button-primary"
              id={`${this.id}-submitButton`}
              onClick={this.props.onButtonClick}>Submit Application</button>
        </div>
      </div>
    );
  }
}

SubmitButton.propTypes = {
  onButtonClick: React.PropTypes.func.isRequired
};

export default SubmitButton;
