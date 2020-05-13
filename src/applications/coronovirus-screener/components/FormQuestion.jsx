import React from 'react';
import FormOption from './FormOption';

class FormQuestion extends React.Component {
  componentDidMount() {
    
  }

  updateField(name, value) {
    this.props.updateField(name, value);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="covid-screener-question">
        <h2>{ this.props.children }</h2>
        <FormOption>Yes</FormOption>
        <FormOption>No</FormOption>
      </div>
    )
  }

}

export default FormQuestion;