import React from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import PropTypes from 'prop-types';
import appendQuery from 'append-query';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import Modal from '../../common/components/Modal';
import { getUserData } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, toggleLoginModal } from '../actions';
import SearchHelpSignIn from '../components/SearchHelpSignIn';
import Signin from '../components/Signin';
import Verify from '../components/Verify';
import { logout } from '../utils/helpers';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

class Main extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.setToken);
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkTokenStatus);
    }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  setToken = (event) => {
    if (event.data === sessionStorage.userToken) { this.props.getUserData(); }
  }

  bindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const nextQuery = { next: el.getAttribute('href') };
        const nextPath = appendQuery('/', nextQuery);
        history.pushState({}, el.textContent, nextPath);
        this.props.toggleLoginModal(true);
      });
    });
  }

  unbindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  }

  checkTokenStatus = () => {
    if (sessionStorage.userToken) {

      // @todo once we have time to replace the confirm dialog with an actual modal we should uncomment this code.
      // if (moment() > moment(sessionStorage.entryTime).add(SESSION_REFRESH_INTERVAL_MINUTES, 'm')) {
      //   if (confirm('For security, you’ll be automatically signed out in 2 minutes. To stay signed in, click OK.')) {
      //     login();
      //   } else {
      //     logout();
      //   }
      // } else {
      //   if (this.props.getUserData()) {
      //     this.props.updateLoggedInStatus(true);
      //   }
      // }

      // @todo after doing the above, remove this code.
      if (this.props.getUserData()) {
        window.dataLayer.push({ event: 'login-user-logged-in' });
        this.props.updateLoggedInStatus(true);
      }
    } else {
      this.props.updateLoggedInStatus(false);
    }
  }

  handleCloseModal = () => {
    this.props.toggleLoginModal(false);
    window.dataLayer.push({ event: 'login-modal-closed' });
  }

  renderModalContent = () => {
    const { currentlyLoggedIn } = this.props.login;

    if (this.props.login.loginUrls) {
      return (<Signin
        onLoggedIn={() => this.props.toggleLoginModal(false)}
        currentlyLoggedIn={currentlyLoggedIn}/>);
    }

    if (this.props.login.loginUrlsError) {
      return (
        <div>
          <br/>
          <h3>Something went wrong on our end</h3>
          <p>Please refresh this page or try again later. You can also call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>
        </div>
      );
    }

    return <LoadingIndicator message="Loading the application..."/>;
  }

  render() {
    let content;

    switch (this.props.renderType) {
      case 'navComponent': {
        content = (
          <div>
            <SearchHelpSignIn onUserLogout={logout}/>
            <Modal
              cssClass="va-modal-large"
              visible={this.props.login.showModal}
              focusSelector="button"
              onClose={this.handleCloseModal}
              id="signin-signup-modal"
              title="Sign in to Vets.gov">
              {this.renderModalContent()}
            </Modal>
          </div>
        );
        break;
      }
      case 'verifyPage':
        content = this.props.profile.loading ?
          (<LoadingIndicator message="Loading the application..."/>) :
          (<Verify
            shouldRedirect={this.props.shouldRedirect}
            login={this.props.login}
            profile={this.props.profile}/>);
        break;
      default:
        content = null;
    }

    return (
      <div>
        {content}
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
    updateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    toggleLoginModal: (update) => {
      dispatch(toggleLoginModal(update));
    },
    getUserData: () => {
      getUserData(dispatch);
    },
  };
};

Main.propTypes = {
  onLoggedIn: PropTypes.func,
  renderType: PropTypes.oneOf([
    'navComponent',
    'verifyPage',
  ]).isRequired,
  shouldRedirect: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
