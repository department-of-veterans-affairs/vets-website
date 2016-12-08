import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import environment from '../../common/helpers/environment.js';

import { updateLoggedInStatus, updateProfileField } from '../../common/actions';

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
    window.opener.sessionStorage.removeItem('userToken');
    window.opener.sessionStorage.setItem('userToken', token);
    window.opener.postMessage(token, environment.BASE_URL);
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
        // This will require a user to MFA if they have not verified in the last 2 mins.
        if (userData.loa.current === 3 && sessionStorage.mfa_start) {
          this.setMyToken(myToken);
        } else {
          sessionStorage.setItem('mfa_start', true);
          this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
            window.location.href = result.authenticate_via_get;
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
      view = <h3>Logging you in...</h3>;
    } else {
      view = (
        <div>
          <h3>We are sorry that we could not successfully log you in.</h3>
          <h3>Please call the Vets.gov Help Desk at 1-855-574-7286. We're open Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).</h3>
          <button onClick={window.close()}>Close</button>
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
