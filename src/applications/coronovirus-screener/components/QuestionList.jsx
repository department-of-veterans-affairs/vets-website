import React from 'react';

class QuestionList extends React.Component {

  render() {
    let l = this.props.children.length;
    return (
      <>
      {this.props.children.map((child, i) => {
        let key = `q-${i.toString()}`;
        return (
          <div className="covid-question" key={key}>
            <h2>Question {i+1} of {l}</h2>
            {child}
          </div>
        )
      })}
      </>
    )
  }

}

export default QuestionList;