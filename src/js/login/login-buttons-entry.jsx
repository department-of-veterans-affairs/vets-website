import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';

import Main from './containers/Main';

require('../common');  // Bring in the common javascript.
require('../../sass/login.scss');

class Buttons extends React.Component {
  render() {
    const login = this.props.login;
    let content;

    if (login.currentlyLoggedIn) {
      const firstName = _.startCase(_.toLower(
        this.props.profile.userFullName.first || sessionStorage.userFirstName
      ));
      const greeting = firstName || this.props.profile.email;

      content = <p>Welcome {greeting}, you are already signed in.</p>;
    } else {
      content = (<div>
        <button className="va-button-secondary usa-button" onClick={this.props.onUserSignup}><strong>Sign up</strong></button>
        <button className="usa-button-outline usa-button" onClick={this.props.onUserLogin}><strong>Log in</strong></button>
      </div>
      );
    }

    return content;
  }
}

export default function createLoginWidget(store) {
  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <Main>
          <Buttons/>
        </Main>
      </Provider>
    ), document.getElementById('login-buttons-root'));
  }

  initReact(init);
}
