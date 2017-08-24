import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import HelpMenu from '../../common/components/HelpMenu';
import SearchMenu from '../../common/components/SearchMenu';
import SignInProfileMenu from './SignInProfileMenu';

import { updateLoggedInStatus, toggleSearchHelpUserMenu } from '../actions';

class SearchHelpSignIn extends React.Component {
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
          this.props.onClickSearchHelpSignIn('account', !login.utilitiesMenuIsOpen.account);
        }}
        greeting={greeting}
        isOpen={login.utilitiesMenuIsOpen.account}
        onUserLogout={this.props.onUserLogout}/>);
    } else {
      content = (<div>
        <a href="#" onClick={this.props.onUserLogin}>Sign In</a><span className="signin-spacer">|</span><a href="#" onClick={this.props.onUserSignup}>Sign up</a>
      </div>
      );
    }
    return (
      <div>
        <SearchMenu
          isOpen={login.utilitiesMenuIsOpen.search}
          clickHandler={() => {
            this.props.onClickSearchHelpSignIn('search', !login.utilitiesMenuIsOpen.search);
          }}/>
        <HelpMenu
          isOpen={login.utilitiesMenuIsOpen.help}
          clickHandler={() => {
            this.props.onClickSearchHelpSignIn('help', !login.utilitiesMenuIsOpen.help);
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

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    onClickSearchHelpSignIn: (menu, isOpen) => {
      dispatch(toggleSearchHelpUserMenu(menu, isOpen));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHelpSignIn);
export { SearchHelpSignIn };
