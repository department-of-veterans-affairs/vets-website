import React from 'react';

export class RegardingSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setVeteran({
      ...this.props.veteran, 
      regarding: event.target.value
    })
  }

  render() {
    return (
      <div className='usa-input-grid'>
        <label htmlFor="document-uploader-regarding">What is this regarding?</label>
        <select name="document-uploader-regarding" id="document-uploader-regarding" value={this.props.veteran.regarding} onChange={this.handleChange}>
          <option value=""> Select </option>
          <option value="nothing">nothing</option>
          <option value="applying-for-disability">applying-for-disability</option>
          <option value="submitting-documents-in-support">submitting-documents-in-support</option>
        </select>
      </div>
    )
  }
}
