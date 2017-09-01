import React from 'react';
import { connect } from 'react-redux';
import { initiateIdRequest } from '../actions';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.initiateIdRequest();
  }

  render() {
    let message;

    if (this.props.loading === true) {
      message = 'Initiating ID Card Request...';
    }
    if (this.props.redirect) {
      message = 'Redirecting to '.concat(this.props.redirect);
      window.location.href = this.props.redirect;
    } else {
      message = 'Huh?';
    }

    const view = (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Veteran ID Card</h1>
          <div>
            <button onClick={this.handleSubmit}>
              Initiate ID Card Request
            </button>
            <p>{message}</p>
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
    isLoading: idState.idcard.loading,
    errors: idState.idcard.errors,
  };
};

const mapDispatchToProps = {
  initiateIdRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
