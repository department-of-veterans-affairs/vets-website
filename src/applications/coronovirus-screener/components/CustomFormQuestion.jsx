import React from 'react';

class CustomFormQuestion extends React.Component {

  render() {
    return (
      <div className="covid-screener-question">
        { this.props.children }
      </div>
    )
  }

}

export default CustomFormQuestion;