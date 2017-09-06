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
        <button onClick={this.handleSubmit} disabled="true">
          Initiating Request...
        </button>
      );
    }
    return (
      <button onClick={this.handleSubmit}>
        Initiate ID Card Request
      </button>
    );
  }

  renderErrors() {
    const content = (
      <div>
        <h4>We couldn't gather your ID card information</h4>
        <div>
          We're sorry. We couldn't gather the information needed for your ID card request. You can try again, or call the Vets.gov Help Desk at 855-574-7286 (TTY: 800-829-4833). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
        </div>
      </div>
    );
    return (
      <AlertBox
        content={content}
        isVisible
        status="warning"/>
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
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Request a Veteran ID Card</h1>
          <p>Verified Veterans may request a printed ID card. Click below to request a card. You will be redirected to a site where you can upload a photo and make sure your information is up to date.</p>
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
