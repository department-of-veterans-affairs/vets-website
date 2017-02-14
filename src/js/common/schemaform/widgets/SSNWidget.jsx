import React from 'react';
import TextWidget from './TextWidget';

export default class SSNWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { val: props.value };
  }
  handleChange = (val) => {
    const strippedSSN = val.replace(/[\- ]/g, '');
    this.setState({ val }, () => {
      this.props.onChange(strippedSSN);
    });
  }
  render() {
    return <TextWidget type="email" {...this.props} value={this.state.val} onChange={this.handleChange}/>;
  }
}
