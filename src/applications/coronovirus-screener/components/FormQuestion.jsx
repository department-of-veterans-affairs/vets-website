import React from 'react';
import FormOption from './FormOption';

class FormQuestion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.handleQuestionClick = this.handleQuestionClick.bind(this);
  }

  handleQuestionClick(e) {
    if (e.target.type !== "button") return;
    this.setState({
      ...this.state,
      value: e.target.value
    });
  }

  render() {
    return (
      <div className="covid-screener-question">
        <h3>{ this.props.children }</h3>
        <FormOption value="true" name={this.props.name} onClick={this.handleChange}>Yes</FormOption>
        <FormOption value="false" disqualifying="true" name={this.props.name} onclick={this.handleChange}>No</FormOption>
      </div>
    )
  }

}

export default FormQuestion;