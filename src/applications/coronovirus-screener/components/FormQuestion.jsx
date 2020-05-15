import React from 'react';
import FormOption from './FormOption';

class FormQuestion extends React.Component {

  render() {
    return (
      <div className="covid-screener-question">
        <h3>{ this.props.children }</h3>
        <FormOption>Yes</FormOption>
        <FormOption>No</FormOption>
      </div>
    )
  }

}

export default FormQuestion;