import React from 'react';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import { makeField } from '../../../common/model/fields.js';

class MessageSubject extends React.Component {
  // TODO: Add errorMessage property to ErrorableTextInput conditionally
  // when the fields are validated.
  render() {
    const subjectValue = makeField(undefined);

    return (
      <div className={this.props.cssClass}>
        <ErrorableTextInput
            additionalClass={`${this.props.cssClass}-input`}
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
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool
};

export default MessageSubject;
