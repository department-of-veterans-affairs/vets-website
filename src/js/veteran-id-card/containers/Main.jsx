import React from 'react';
import { connect } from 'react-redux';
import { has, head } from 'lodash';
import { initiateIdRequest, timeoutRedirect } from '../actions';
import { messages } from '../config';
import AlertBox from '../../common/components/AlertBox';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderVicForm = this.renderVicForm.bind(this);
  }

  componentDidUpdate() {
    if (this.props.vicUrl) {
      document.getElementById('vicForm').submit();
      setTimeout(this.props.timeoutRedirect, 10000);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.initiateIdRequest();
  }

  renderVicForm() {
    return (
      <div>
        {!!this.props.vicUrl &&
          <form id="vicForm" method="POST" action={this.props.vicUrl}>
            {Object.entries(this.props.traits).map(([key, value]) => (
              <input type="hidden" name={key} key={key} value={value}/>
            ))}
          </form>
        }
      </div>
    );
  }

  renderButton() {
    if ((this.props.fetching || this.props.vicUrl) && !this.props.vicError) {
      return (
        <button className="usa-button-primary va-button-primary" onClick={this.handleSubmit} disabled="true">
          Redirecting...
        </button>
      );
    }
    return (
      <button className="usa-button-primary va-button-primary" onClick={this.handleSubmit}>
        Apply for a Veteran ID card<span className="exit-icon">&nbsp;</span>
      </button>
    );
  }

  renderVicError() {
    const content = (
      <div>
        <h4>We're sorry. Something went wrong when loading the page.</h4>
        <div>
          <p>Please refresh the page or try again later. You can also call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>
        </div>
      </div>
    );
    return (
      <AlertBox
        content={content}
        isVisible
        status="error"/>
    );
  }

  renderErrors() {
    const { errors } = this.props;
    const code = head(errors).code;
    const detail = has(messages, code) ? messages[code] : messages.default;
    const content = (
      <div>
        <h4>We can't process your request</h4>
        <div>
          <p>{detail}</p>
        </div>
      </div>
    );
    return (
      <AlertBox
        content={content}
        isVisible
        status="error"/>
    );
  }

  render() {
    let message;

    if (this.props.errors) {
      message = this.renderErrors();
    }

    const view = (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 vet-id-card">
          <h1>Request a Veteran ID Card</h1>
          <p>If you’re a Veteran and you don’t already have a Veterans Health Identification Card (VHIC) or a retirement card issued by the Department of Defense (DoD), you can request a printed Veteran ID Card.</p>
          <p>This card gives you an easy way to show proof of your service so you can access discounted goods and services offered to Veterans.</p>
          <h3>Ready to apply?</h3>
          <div>
            {this.renderButton()}
            <div>{message}</div>
            {this.props.vicError && this.renderVicError()}
          </div>
          {this.renderVicForm()}
        </div>
      </div>
    );

    return (
      <div>
        {view}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const idState = state.idcard;
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
    vicUrl: idState.idcard.vicUrl,
    traits: idState.idcard.traits,
    fetching: idState.idcard.fetching,
    errors: idState.idcard.errors,
  };
};

const mapDispatchToProps = {
  initiateIdRequest,
  timeoutRedirect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
