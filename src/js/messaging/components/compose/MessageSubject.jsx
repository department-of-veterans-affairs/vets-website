import React from 'react';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';

class MessageSubject extends React.Component {
  // TODO: Add errorMessage property to ErrorableTextInput conditionally
  // when the fields are validated.
  render() {
    return (
      <div className={this.props.cssClass}>
        <ErrorableTextInput
            charMax={this.props.charMax}
            additionalClass={`${this.props.cssClass}-input`}
            label="Subject"
            onValueChange={this.props.onValueChange}
            required={this.props.required}
            placeholder={this.props.placeholder}
            name="messageSubject"
            field={this.props.subject}/>
      </div>
    );
  }
}

MessageSubject.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  subject: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired
};

export default MessageSubject;
