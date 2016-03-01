import React from 'react';
import _ from 'lodash';

class FullName extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false };
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
    };

    const requiredFields = [this.refs.first, this.refs.last];

    for (let i = 0; i < requiredFields.length; i++) {
      const errorDiv = requiredFields[i].parentElement;

      errorDiv.classList.remove('uk-input-error');

      if (!this.validate(requiredFields[i])) {
        this.setState({ hasError: true });
        errorDiv.classList.add('uk-input-error');
      } else {
        this.setState({ hasError: false });
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
          <label htmlFor={`${this.id}-first-name`}>First Name
            <span className="uk-additional_text">Required</span>
          </label>
          <input type="text" value={this.props.name.first} id={`${this.id}-first-name`}
              ref="first" onChange={this.handleChange}/>
        </div>

        <div>
          <label htmlFor={`${this.id}-middle-name`}>Middle Name</label>
          <input type="text" value={this.props.name.middle} id={`${this.id}-middle-name`}
              ref="middle" onChange={this.handleChange}/>
        </div>

        <div>
          <label htmlFor={`${this.id}-last-name`}>Last Name
            <span className="uk-additional_text">Required</span>
          </label>
          <input type="text" value={this.props.name.last} id={`${this.id}-last-name`}
              ref="last" onChange={this.handleChange}/>
        </div>

        <div className="uk-input-grid uk-input-grid-small">
          <label htmlFor={`${this.id}-suffix-name`}>Suffix</label>
          <select value={this.props.name.suffix} id={`${this.id}-suffix-name`}
              ref="suffix" onChange={this.handleChange}>
            <option value=""></option>
            <option value="JR">Jr.</option>
            <option value="SR">Sr.</option>
          </select>
        </div>
      </div>
    );
  }
}

export default FullName;
