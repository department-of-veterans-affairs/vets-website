import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import { apiRequest } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';
import { gaClientId } from '../../common/utils/helpers';
import { updateLoggedInStatus } from '../../login/actions';

class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.checkUserLevel = this.checkUserLevel.bind(this);
    this.identityProof = this.identityProof.bind(this);
    this.setError = this.setError.bind(this);
    this.setMyToken = this.setMyToken.bind(this);

    const { token } = props.location.query;
    this.state = { error: !token };
    this.authSettings = {
      headers: {
        Authorization: `Token token=${token}`
      }
    };
  }

  componentDidMount() {
    if (!this.state.error) { this.checkUserLevel(); }
  }

  setMyToken(token) {
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line spaced-comment
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;

    const parent = window.opener;
    parent.sessionStorage.removeItem('userToken');
    parent.sessionStorage.setItem('userToken', token);
    parent.postMessage(token, environment.BASE_URL);

    // This will trigger a browser reload if the user is using IE or Edge.
    if (isIE || isEdge) {
      window.opener.location.reload();
    }

    window.close();
  }

  setError() {
    this.setState({ error: true });
  }

  checkUserLevel() {
    apiRequest('/user', this.authSettings, this.identityProof, this.setError);
  }

  identityProof({ data }) {
    const myToken = this.props.location.query.token;
    const userData = data.attributes.profile;
    const loginMethod = userData.authnContext || 'idme';
    window.dataLayer.push({ event: `login-success-${loginMethod}` });

    if (userData.loa.highest === 3) {
      if ((userData.loa.current === 3 && sessionStorage.mfa_start) || userData.authnContext) {
        this.setMyToken(myToken);
      } else {
        const redirect = ({ identityProofUrl }) => {
          window.location.href = appendQuery(
            identityProofUrl,
            { clientId: gaClientId() }
          );
        };

        sessionStorage.setItem('mfa_start', true);
        apiRequest('/sessions/identity_proof', this.authSettings, redirect, this.setError);
      }
    } else {
      this.setMyToken(myToken);
    }
  }

  render() {
    let view;

    if (this.state.error) {
      view = (
        <div>
          <h3>We are sorry that we could not successfully log you in.</h3>
          <h3>Please call the Vets.gov Help Desk at 1-855-574-7286. We’re open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).</h3>
          <button onClick={window.close}>Close</button>
        </div>
      );
    } else {
      view = (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Signing in to Vets.gov...</h3>
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="small-12 columns">
          <div>
            {view}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    profile: state.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AuthApp);
export { AuthApp };
