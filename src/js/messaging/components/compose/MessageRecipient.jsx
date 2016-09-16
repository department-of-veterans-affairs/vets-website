import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import { makeField } from '../../../common/model/fields';

class MessageRecipient extends React.Component {
  render() {
    const recipientValue = makeField(undefined);
    return (
      <div className={this.props.cssClass}>
        <ErrorableSelect
            label="To:"
            name="messageRecipient"
            onValueChange={this.props.onValueChange}
            options={this.props.options}
            value={recipientValue}/>
      </div>
    );
  }
}

MessageRecipient.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.number }),
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string })
    ])).isRequired
};

export default MessageRecipient;
