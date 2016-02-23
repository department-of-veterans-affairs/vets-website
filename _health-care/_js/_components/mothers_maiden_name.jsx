import React from 'react';
import _ from 'lodash';

class MothersMaidenName extends React.Component {
  constructor() {
    super();
    this.state = {hasError: false};
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange() {
    const name = this.refs.name.value;

    if (!this.validate(name)) {
      this.setState({hasError: true});
    } else {
      this.setState({hasError: false});
    }

    this.props.onUserInput(name);    
  }

  validate(field) {
    if (field === '') {
      return true;
    } else {
      return /^[a-zA-Z '\-]+$/.test(field);
    }
  }

  render() {
    const error_class = this.state.hasError ? "usa-input-error" : ""
    return (
      <div>
        <div className={`usa-input-grid usa-input-grid-large ${error_class}`}>
          <label htmlFor={this.id + "_mothers_maiden_name"}>Mother’s Maiden Name</label>
          <input type="text" id={this.id + "_mothers_maiden_name"} value={this.state.name} 
            ref="name" onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
}

export default MothersMaidenName
