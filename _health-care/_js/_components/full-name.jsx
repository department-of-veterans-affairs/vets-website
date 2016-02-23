import React from 'react';
import _ from 'lodash';

class FullName extends React.Component {
  constructor() {
    super();
    this.state = {hasError: false};
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange() {
    const name = {
      first: this.refs.first.value,
      middle: this.refs.middle.value,
      last: this.refs.last.value,
      suffix: this.refs.suffix.value
    }

    const requiredFields = [this.refs.first, this.refs.last];

    for (let i=0; i<requiredFields.length; i++) {
      let errorDiv = requiredFields[i].parentElement;
      
      errorDiv.classList.remove('usa-input-error');

      if (!this.validate(requiredFields[i])) {
        this.setState({hasError: true});
        errorDiv.classList.add('usa-input-error');
      } else {
        this.setState({hasError: false});
      }
    }

    this.props.onUserInput(name);
  }

  validate(field) {
    return field !== '' && /^[a-zA-Z '\-]+$/.test(field.value);
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor={this.id + "_first_name"}>First Name
            <span className="usa-additional_text">Required</span>
          </label>
          <input type="text" value={this.props.name.first} id={this.id + "_first_name"}
            ref="first" onChange={this.handleChange} />
        </div>

        <div>
          <label htmlFor={this.id + "_middle_name"}>Middle Name</label>
          <input type="text" value={this.props.name.middle} id={this.id + "_middle_name"}
            ref="middle" onChange={this.handleChange} />
        </div>

        <div>
          <label htmlFor={this.id + "_last_name"}>Last Name
            <span className="usa-additional_text">Required</span>
          </label>
          <input type="text" value={this.props.name.last} id={this.id + "_last_name"}
            ref="last" onChange={this.handleChange} />
        </div>

        <div className="usa-input-grid usa-input-grid-small">
          <label htmlFor={this.id + "_suffix_name"}>Suffix</label>
          <select value={this.props.name.suffix} id={this.id + "_suffix_name"}
            ref="suffix" onChange={this.handleChange}>
            <option value=""></option>
            <option value="JR">Jr.</option>
            <option value="SR">Sr.</option>
          </select>
        </div>
      </div>
    )
  }
}

export default FullName
