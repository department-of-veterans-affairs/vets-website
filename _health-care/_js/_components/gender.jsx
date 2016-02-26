import React from 'react';
import _ from 'lodash';

class Gender extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange() {
    const gender = this.refs.gender.value;

    if (this.validate(gender)) {
      this.setState({ hasError: false });
    } else {
      this.setState({ hasError: true });
    }

    this.props.onUserInput(gender);
  }

  validate(field) {
    if (field === '0' || field === 'F' || field === 'M') {
      return true;
    }
    return false;
  }

  render() {
    const errorClass = this.state.hasError ? 'usa-input-error' : '';
    return (
      <div>
        <div className={`usa-input-grid usa-input-grid-large ${errorClass}`}>
          <label htmlFor={`${this.id}-gender`}>
            Gender
          </label>
          <select
              id={`${this.id}-gender`}
              ref="gender"
              value={this.props.gender}
              onChange={this.handleChange}>
            <option value="0"></option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>
    );
  }
}

export default Gender;
