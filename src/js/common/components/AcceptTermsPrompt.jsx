/* eslint-disable react/no-danger */
import React from 'react';

class CreateMHVAccountPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ scrolledToBottom: false, yesSelected: false });
  }

  handleSubmit() {
    // In here we need to POST to
    // /v0/terms_and_conditions/mhvac/versions/latest/user_data
    // to accept the terms, and then we need to let the RequiredTermsAcceptanceView
    // display its children.
  }

  handleScroll(event) {
    const ct = event.currentTarget;
    if ((ct.scrollTop + ct.offsetHeight) >= ct.scrollHeight) {
      this.setState({ scrolledToBottom: true, yesSelected: this.state.yesSelected });
    }
  }

  handleAnswer(event) {
    if (event.currentTarget.value === 'yes' && event.currentTarget.checked) {
      this.setState({ scrolledToBottom: this.state.scrolledToBottom, yesSelected: true });
    }
  }

  render() {
    // loading state for terms content is handled by parent component
    const { terms } = this.props;

    let submitButton = <button className="usa-button-disabled" disabled>Submit</button>;
    if (this.state.scrolledToBottom && this.state.yesSelected) {
      submitButton = <button className="usa-button" onClick={this.handleSubmit}>Submit</button>;
    }

    let noRadio = (<div>
      <input type="radio" name="form-selection" id="form-no" value="no" onChange={this.handleAnswer}/>
      <label htmlFor="form-no">
        {terms.content.noContent}
      </label>
    </div>);

    if (terms.content.noContent === null) {
      noRadio = <div></div>;
    }

    return (
      <div className="row primary terms-acceptance">
        <div className="small-12 columns usa-content">
          <div dangerouslySetInnerHTML={{ __html: terms.content.headerContent }}/>
          <h1>{terms.content.title}</h1>
          <div className="terms-box">
            <div className="terms-head">
              Scroll to read the full terms and conditions to continue
            </div>
            <div className="terms-scroller" onScroll={this.handleScroll}>
              <div dangerouslySetInnerHTML={{ __html: terms.content.termsContent }}/>
            </div>
          </div>
          <div className="form-radio-buttons">
            <input type="radio" name="form-selection" id="form-yes" value="yes" onChange={this.handleAnswer}/>
            <label htmlFor="form-yes">
              {terms.content.yesContent}
            </label>
            {noRadio}
          </div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: terms.content.footerContent }}/>
          </div>
          <div>
            {submitButton}
            <button className="usa-button-outline">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateMHVAccountPrompt;
