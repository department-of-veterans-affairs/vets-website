import React from 'react';

export class RegardingSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setVeteran({
      ...this.props.veteran,
      regarding: event.target.value,
    });
  }

  render() {
    const options = ['Disability', 'Pension', 'Appeals', 'Other'];
    const optionElements = options.map((option, i) => (
      <option value={option.lowerCase} key={i}>
        {option}
      </option>
    ));
    return (
      <div className="usa-input-grid">
        <label htmlFor="document-uploader-regarding">
          What is this regarding?
        </label>
        <select
          name="document-uploader-regarding"
          id="document-uploader-regarding"
          value={this.props.veteran.regarding}
          onChange={this.handleChange}
        >
          <option value=""> Select a topic </option>
          {optionElements}
        </select>
      </div>
    );
  }
}
