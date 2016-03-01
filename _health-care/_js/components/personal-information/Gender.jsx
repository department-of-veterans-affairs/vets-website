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

  render() {
    const errorClass = this.state.hasError ? 'uk-input-error' : '';
    return (
      <div>
        <div className={`uk-input-grid uk-input-grid-large ${errorClass}`}>
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
