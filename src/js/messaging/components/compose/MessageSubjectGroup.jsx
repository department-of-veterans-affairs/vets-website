import React from 'react';
import classNames from 'classnames';
import MessageCategory from './MessageCategory';
import MessageSubject from './MessageSubject';

class MessageSubjectGroup extends React.Component {
  // TODO: Add errorMessage property to ErrorableTextInput conditionally
  // when the fields are validated.
  render() {
    const hasErrorMsg = !!this.props.errorMessage;

    const errItemClass = classNames(
      this.props.cssErrorClass,
      'msg-subject-group',
      { 'usa-input-error': hasErrorMsg },
      { 'msg-compose-error': hasErrorMsg }
    );

    const errMsgClass = classNames(
      { 'msg-compose-error-message': hasErrorMsg },
      { 'usa-input-error-message': hasErrorMsg },
    );

    let errMessage;
    if (hasErrorMsg) {
      errMessage = <div className={errMsgClass}>{this.props.errorMessage}</div>;
    }

    return (
      <fieldset>
        <div className={errItemClass}>
          <div className="msg-subject-group-inner">
            <legend>Subject line:</legend>
            <div>
              {errorMessage}
              <div className="msg-subject-line">
                <MessageCategory
                    categories={this.props.categories}
                    category={this.props.category}
                    cssClass="msg-category"
                    onValueChange={this.props.onCategoryChange}/>
                <MessageSubject
                    charMax={this.props.charMax}
                    cssClass="msg-subject"
                    onValueChange={this.props.onSubjectChange}
                    placeholder={this.props.subjectPlaceholder}
                    required={this.props.subjectRequired}
                    subject={this.props.subject}/>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    );
  }
}

MessageSubjectGroup.propTypes = {
  categories: React.PropTypes.array,
  category: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }),
  charMax: React.PropTypes.number,
  cssErrorClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  errorType: React.PropTypes.string,
  onCategoryChange: React.PropTypes.func,
  onSubjectChange: React.PropTypes.func,
  subject: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }),
  subjectPlaceholder: React.PropTypes.string
};

export default MessageSubjectGroup;
