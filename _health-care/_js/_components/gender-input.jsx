import React from 'react';
import _ from 'lodash';

class GenderInput extends React.Component {
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
    if (field === '') {
      return true;
    }
    return /^[a-zA-Z '\-]+$/.test(field);
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
              type="text"
              value={this.props.gender}
              onChange={this.handleChange}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="2">NeedOtherOfficialOptions</option>
          </select>
        </div>
      </div>
    );
  }
}

export default GenderInput;
