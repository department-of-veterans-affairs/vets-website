import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import classNames from 'classnames';

class MessageRecipient extends React.Component {
  render() {
    const fieldCss = classNames(
      this.props.cssClass,
      { 'usa-input-error': !!this.props.errorMessage },
      { 'msg-compose-error': !!this.props.errorMessage }
    );

    return (
      <div className={fieldCss}>
        <ErrorableSelect
            errorMessage={this.props.errorMessage}
            label="To"
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
