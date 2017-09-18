import React from 'react';
import { connect } from 'react-redux';
import { initiateIdRequest } from '../actions';
import AlertBox from '../../common/components/AlertBox';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.initiateIdRequest();
  }

  renderButton() {
    if (this.props.fetching === true || this.props.redirect) {
      return (
        <button className="usa-button-primary va-button-primary" onClick={this.handleSubmit} disabled="true">
          Requesting...
        </button>
      );
    }
    return (
      <button className="usa-button-primary va-button-primary" onClick={this.handleSubmit}>
        Go to [ID Card Site] to request a card <span className="exit-icon">&nbsp;</span>
      </button>
    );
  }

  renderErrors() {
    const content = (
      <div>
        <h4>We can't process your request</h4>
        <div>
          We're sorry. We couldn't gather the information needed for your ID card request. You can try again, or call the Vets.gov Help Desk at 855-574-7286 (TTY: 800-829-4833). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
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
    } else if (this.props.redirect) {
      message = (
        <p>Redirecting to Veteran ID Card site...</p>
      );
      window.location.href = this.props.redirect;
    }

    const view = (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 vet-id-card">
          <h1>Request a Veteran ID Card</h1>
          <p>If you’re a Veteran and you don’t already have a Veterans Health Identification Card (VHIC) or a retirement card issued by the Department of Defense (DoD), you can request a printed Veteran ID Card. This card gives you an easy way to show proof of your service so you can access discounted goods and services offered to Veterans.</p>
          <div style={{ paddingBottom: '2em' }}>
            {this.renderButton()}
            <div>{message}</div>
          </div>
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
    redirect: idState.idcard.redirect,
    fetching: idState.idcard.fetching,
    errors: idState.idcard.errors,
  };
};

const mapDispatchToProps = {
  initiateIdRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
