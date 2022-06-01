import React from "react";

export class LongCovidWebform extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      q1: "",
      q2: ""
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onValueChange(event) {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  }

  formSubmit(event) {
    event.preventDefault();
    console.log(this.state.q1);
    console.log(this.state.q2);
  }

  render() {
    return (
      <form onSubmit={this.formSubmit}>
        <div>
          Question 1
          <div className="radio">
            <label>
              <input
                type="radio"
                value="Yes"
                checked={this.state.q1 === "Yes"}
                onChange={this.onValueChange}
                name="q1"
              />
              Yes
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="No"
                checked={this.state.q1 === "No"}
                onChange={this.onValueChange}
                name="q1"
              />
              No
            </label>
          </div>
        </div>
        <div>
          Question 2
          <div className="radio">
            <label>
              <input
                type="radio"
                value="Yes"
                checked={this.state.q2 === "Yes"}
                onChange={this.onValueChange}
                name="q2"
              />
              Yes
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="No"
                checked={this.state.q2 === "No"}
                onChange={this.onValueChange}
                name="q2"
              />
              No
            </label>
          </div>
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}