import React from 'react';

class CustomFormQuestion extends React.Component {

  render() {
    return (
      <div className="covid-screener-question">
        <h3>{ this.props.question }</h3>
        {this.props.children.map((child, i) => {
            let p = { ...child.props };
            p.name = this.props.name;
            return { ...child, props: p };
        })}
      </div>
    )
  }

}

export default CustomFormQuestion;