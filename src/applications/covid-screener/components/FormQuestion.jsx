import React from 'react';

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
        <h2>{ this.props.question }</h2>
        { this.props.children }
      </div>
    )
  }

}

export default FormQuestion;