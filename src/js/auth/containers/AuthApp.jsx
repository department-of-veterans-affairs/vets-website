import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
    if (__BUILDTYPE__ !== 'production') {
      this.serverRequest = $.get(`${environment.API_URL}/v0/sessions/new?level=3`, result => {
        this.setState({ verifyUrl: result.authenticate_via_get });
      });
    }

    this.checkUserLevel();
  }

  setMyToken(token) {
    window.opener.localStorage.removeItem('userToken');
    window.opener.localStorage.setItem('userToken', token);
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
        if (userData.loa.current === 3 && !(moment() > moment(userData.last_signed_in).add(2, 'm'))) {
          this.setMyToken(myToken);
        } else {
          window.open(this.state.verifyUrl, '_self');
        }
      } else {
        this.setMyToken(myToken);
      }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <div>
            <h3>Logging you in...</h3>
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
