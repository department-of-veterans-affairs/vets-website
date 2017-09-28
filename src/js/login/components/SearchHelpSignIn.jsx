import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import URLSearchParams from 'url-search-params';

import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

import { toggleLoginModal, toggleSearchHelpUserMenu } from '../actions';

class SearchHelpSignIn extends React.Component {
  componentDidMount() {
    const nextParams = new URLSearchParams(window.location.search);
    const nextPath = nextParams.get('next');
    if (nextPath) {
      this.props.toggleLoginModal(true);
    }
  }

  handleSigninSignup = (e) => {
    e.preventDefault();
    window.dataLayer.push({ event: 'login-link-clicked' });
    this.props.toggleLoginModal(true);
  }

  render() {
    let content;
    const login = this.props.login;

    if (login.currentlyLoggedIn) {
      const firstName = _.startCase(_.toLower(
        this.props.profile.userFullName.first || sessionStorage.userFirstName
      ));
      const greeting = firstName || this.props.profile.email;

      content = (<SignInProfileMenu
        clickHandler={() => {
          this.props.toggleSearchHelpUserMenu('account', !login.utilitiesMenuIsOpen.account);
        }}
        greeting={greeting}
        isOpen={login.utilitiesMenuIsOpen.account}
        onUserLogout={this.props.onUserLogout}/>);
    } else if (this.props.profile.loading) {
      content = null;
    } else {
      content = (<div>
        <a href="#" onClick={this.handleSigninSignup}><span>Sign in</span><span className="signin-spacer">|</span><span>Sign up</span></a>
      </div>
      );
    }
    return (
      <div className="profileNav">
        <SearchMenu
          isOpen={login.utilitiesMenuIsOpen.search}
          clickHandler={() => {
            this.props.toggleSearchHelpUserMenu('search', !login.utilitiesMenuIsOpen.search);
          }}/>
        <HelpMenu
          isOpen={login.utilitiesMenuIsOpen.help}
          clickHandler={() => {
            this.props.toggleSearchHelpUserMenu('help', !login.utilitiesMenuIsOpen.help);
          }}/>
        <div className="sign-in-link">
          {content}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHelpSignIn);
export { SearchHelpSignIn };
