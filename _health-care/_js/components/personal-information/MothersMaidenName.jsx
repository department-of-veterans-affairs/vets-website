import React from 'react';
import _ from 'lodash';

class MothersMaidenName extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange() {
    const name = this.refs.name.value;

    if (this.validate(name)) {
      this.setState({ hasError: false });
    } else {
      this.setState({ hasError: true });
    }

    this.props.onUserInput(name);
  }

  validate(field) {
    if (field === '') {
      return true;
    }
    return /^[a-zA-Z '\-]+$/.test(field);
  }

  render() {
    const errorClass = this.state.hasError ? 'uk-input-error' : '';
    return (
      <div>
        <div className={`uk-input-grid uk-input-grid-large ${errorClass}`}>
          <label htmlFor={`${this.id}-mothers-maiden-name`}>
            Mother’s Maiden Name
          </label>
          <input
              id={`${this.id}-mothers-maiden-name`}
              ref="name"
              type="text"
              value={this.props.name}
              onChange={this.handleChange}/>
        </div>
      </div>
    );
  }
}

export default MothersMaidenName;
