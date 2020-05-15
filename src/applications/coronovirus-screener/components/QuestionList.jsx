import React from 'react';

class QuestionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {questionLength: this.props.children.length};
    this.handleQuestionClick = this.handleQuestionClick.bind(this);
  }

  handleQuestionClick(e) {
    if (e.target.type !== "button") return;
    let key = e.target.name;
    let value = e.target.value;
    this.setState({
      ...this.state,
      [key]: value,
    });
  }

  render() {
    let l = this.props.children.length;
    return (
      <>
      {this.props.children.map((child, i) => {
        let key = `q-${i.toString()}`;
        return (
          <div className="covid-screener-question-wrapper" key={key} onClick={this.handleQuestionClick}>
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