import React from 'react';
import TextWidget from './TextWidget';

export default class SSNWidget extends React.Component {
  handleChange = (val) => {
    this.props.onChange(val.replace(/\D/g, ''));
  }
  render() {
    return <TextWidget type="email" {...this.props} onChange={this.handleChange}/>;
  }
}
