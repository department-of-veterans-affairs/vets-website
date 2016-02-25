import React from 'react';
import _ from 'lodash';

import TextInputRequired from './text-input-required';

/**
 * A component for social security number. Includes component for required text input.
 * Adds error markup if in an error state: error class, error id for aria, and
 * ErrorMessage component.
 *
 * @constructor
 */
class SocialSecurityNumber extends React.Component {
  constructor() {
    super();
    // In general, I think we need to store the error state at the top level component,
    // like we are with form data, and create the one-way data flow with that as well.
    // This may solve the problems we're having with fields not registering errors
    // on page refresh.
    this.state = { hasError: false };
    this.handleErrorChange = this.handleErrorChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  // TODO: What this really needs to do is loop through the inputs and if any have
  // a state of true it needs to set the error state to true
  // TODO: Issue #1238: figure out why this isn't getting called the first time
  handleErrorChange(state) {
    this.setState({ hasError: state });
  }

  render() {
    const errorClass = this.state.hasError ? 'usa-input-error' : '';
    return (
      <div>
        <div className={`usa-input-grid usa-input-grid-medium ${errorClass}`}>
          <label className={`${errorClass}-label`} htmlFor={`${this.id}_snn`}>Social Security Number
            <span className="usa-additional_text">Required Hi</span>
          </label>
          <TextInputRequired
              errorMessage="Please put your number in this format xxx-xx-xxxx"
              // I don't think these "passUp" functions are a good idea, but it's just something
              // I mocked up to see if the concept would even work.
              passErrorUp={(state) => {this.handleErrorChange(state);}}
              passValueUp={(update) => {this.props.onUserInput(update);}}
              placeholder="xxx-xx-xxxx"
              question="ssn"
              questionValue={this.props.ssn}/>
        </div>
      </div>
    );
  }
}

export default SocialSecurityNumber;
