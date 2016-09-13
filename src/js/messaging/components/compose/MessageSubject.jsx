import React from 'react';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import { makeField } from '../../../common/model/fields.js';

class MessageSubject extends React.Component {
  render() {
    const subjectValue = makeField(this.props.value);

    return (
      <div className="messaging-subject">
        <ErrorableTextInput
            errorMessage={this.props.errorMessage}
            label="Subject Line:"
            onValueChange={this.props.onValueChange}
            placeholder={this.props.placeholder}
            name="messageSubject"
            required
            field={subjectValue}/>
      </div>
    );
  }
}

MessageSubject.propTypes = {
  errorMessage: React.PropTypes.string,
  subjectClass: React.PropTypes.string,
  name: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  value: React.PropTypes.string
};

export default MessageSubject;
