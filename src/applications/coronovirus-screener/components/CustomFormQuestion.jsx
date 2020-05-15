import React from 'react';

class CustomFormQuestion extends React.Component {

  render() {
    return (
      <div className="covid-screener-question">
        <h3>{ this.props.question }</h3>
        { this.props.children }
      </div>
    )
  }

}

export default CustomFormQuestion;