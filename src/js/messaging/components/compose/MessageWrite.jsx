import React from 'react';
import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';

class MessageWrite extends React.Component {
  constructor() {
    super();
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  handleMessageChange(valueObj) {
    this.props.onValueChange('message.text', valueObj);
    this.props.onCharCountChange(valueObj, this.props.maxChars);
  }

  render() {
    return (
      <div className={this.props.cssClass}>
        <ErrorableTextarea
            errorMessage={this.props.errorMessage}
            label="Message:"
            onValueChange={this.handleMessageChange}
            placeholder={this.props.placeholder}
            name="messageSubject"
            field={this.props.text}/>
      </div>
    );
  }
}

MessageWrite.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  maxChars: React.PropTypes.number.isRequired,
  onCharCountChange: React.PropTypes.func.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  text: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired
};

export default MessageWrite;
