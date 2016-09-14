import React from 'react';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import { makeField } from '../../../common/model/fields.js';

class MessageSubject extends React.Component {
  render() {
    const subjectValue = makeField(this.props.value);

    return (
      <div className="messaging-subject">
        <ErrorableTextInput
            additionalClass="messaging-subject-input"
            errorMessage={this.props.errorMessage}
            label="Subject"
            onValueChange={this.props.onValueChange}
            required={this.props.required}
            placeholder={this.props.placeholder}
            name="messageSubject"
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
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  value: React.PropTypes.string
};

export default MessageSubject;
