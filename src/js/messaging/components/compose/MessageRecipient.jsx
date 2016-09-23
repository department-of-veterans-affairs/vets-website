import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';

class MessageRecipient extends React.Component {
  render() {
    return (
      <div className={this.props.cssClass}>
        <ErrorableSelect
            label="To:"
            name="messageRecipient"
            onValueChange={this.props.onValueChange}
            options={this.props.options}
            value={this.props.recipient}/>
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
    ])).isRequired,
  recipient: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired
};

export default MessageRecipient;
