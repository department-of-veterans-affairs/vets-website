import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import { apiRequest } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';
import { updateLoggedInStatus } from '../../login/actions';

class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.checkUserLevel = this.checkUserLevel.bind(this);
    this.handleAuthSuccess = this.handleAuthSuccess.bind(this);
    this.setError = this.setError.bind(this);
    this.setToken = this.setToken.bind(this);

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

  setToken() {
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line spaced-comment
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;

    const { token } = this.props.location.query;
    const parent = window.opener;
    parent.sessionStorage.removeItem('userToken');
    parent.sessionStorage.setItem('userToken', token);
    parent.sessionStorage.removeItem('entryTime');
    parent.sessionStorage.setItem('entryTime', new Date());
    parent.postMessage(token, environment.BASE_URL);

    // This will trigger a browser reload if the user is using IE or Edge.
    if (isIE || isEdge) { window.opener.location.reload(); }
    window.close();
  }

  setError() {
    this.setState({ error: true });
  }

  checkUserLevel() {
    // Fetch the user to get the login policy and validate the token against the API.
    apiRequest('/user', this.authSettings, this.handleAuthSuccess, this.setError);
  }

  handleAuthSuccess({ data }) {
    // Upon successful authentication, push analytics event and store the token.
    const userData = data.attributes.profile;
    const loginPolicy = userData.authnContext || 'idme';
    window.dataLayer.push({ event: `login-success-${loginPolicy}` });
    this.setToken();
  }

  render() {
    let view;

    if (this.state.error) {
      view = (
        <div>
          <h3>We're sorry that we couldn't successfully log you in.</h3>
          <h3>Please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>. We're open Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</h3>
          <button onClick={window.close}>Close</button>
        </div>
      );
    } else {
      view = <LoadingIndicator message="Signing in to Vets.gov..."/>;
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
  const { login, profile } = state;
  return { login, profile };
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
