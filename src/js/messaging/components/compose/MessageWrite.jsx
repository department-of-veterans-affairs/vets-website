import React from 'react';
import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';

class MessageWrite extends React.Component {
  render() {
    return (
      <div className={this.props.cssClass}>
        <ErrorableTextarea
            errorMessage={this.props.errorMessage}
            label="Message:"
            onValueChange={this.props.onValueChange}
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
  placeholder: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
  text: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired
};

export default MessageWrite;
