import React from 'react';
import _ from 'lodash';

/**
 * Select component for getting a person's gender.
 *
 * No validation is provided since base UI elements provide all
 * common options as provided in reference PDF/JS form.
 */
class Gender extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.selectId = _.uniqueId('gender-select-');
  }

  handleChange(domEvent) {
    this.props.onUserInput(domEvent.target.value);
  }

  render() {
    return (
      <div>
        <label htmlFor={this.selectId}>
          Gender
        </label>
        <select
            id={this.selectId}
            onChange={this.handleChange}
            value={this.props.value}>
          <option value=""></option>
          <option value="F">Female</option>
          <option value="M">Male</option>
        </select>
      </div>
    );
  }
}

export default Gender;
