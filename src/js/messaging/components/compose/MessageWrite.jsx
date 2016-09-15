import React from 'react';
import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';
import { makeField } from '../../../common/model/fields';

class MessageWrite extends React.Component {
  render() {
    const messageValue = makeField(undefined);

    return (
      <div className={this.props.cssClass}>
        <ErrorableTextarea
            errorMessage={this.props.errorMessage}
            label="Message:"
            onValueChange={this.props.onValueChange}
            placeholder={this.props.placeholder}
            name="messageSubject"
            field={messageValue}/>
      </div>
    );
  }
}

MessageWrite.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
};

export default MessageWrite;
