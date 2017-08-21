import React from 'react';
import { connect } from 'react-redux';

import environment from '../../common/helpers/environment.js';

import { updateLoggedInStatus } from '../../login/actions';
import { updateProfileField } from '../../user-profile/actions';

class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.setMyToken = this.setMyToken.bind(this);
    this.checkUserLevel = this.checkUserLevel.bind(this);
  }

  componentDidMount() {
    if (this.props.location.query.token) {
      this.checkUserLevel();
    }
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

  checkUserLevel() {
    const myToken = this.props.location.query.token;
    fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${myToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      const userData = json.data.attributes.profile;
      if (userData.loa.highest === 3) {
        if (userData.loa.current === 3 && sessionStorage.mfa_start) {
          this.setMyToken(myToken);
        } else {
          sessionStorage.setItem('mfa_start', true);

          this.serverRequest = fetch(`${environment.API_URL}/v0/sessions/new?level=3`, {
            method: 'GET',
          }).then(response => {
            return response.json();
          }).then(innerJson => {
            window.location.href = innerJson.authenticate_via_get;
          });
        }
      } else {
        this.setMyToken(myToken);
      }
    });
  }

  render() {
    let view;

    if (this.props.location.query.token) {
      view = (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Signing in to Vets.gov...</h3>
          </div>
        </div>
      );
    } else {
      view = (
        <div>
          <h3>We are sorry that we could not successfully log you in.</h3>
          <h3>Please call the Vets.gov Help Desk at 1-855-574-7286. We’re open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).</h3>
          <button onClick={window.close}>Close</button>
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
    },
    onUpdateProfile: (field, update) => {
      dispatch(updateProfileField(field, update));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AuthApp);
export { AuthApp };
