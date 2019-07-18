import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import NotAuthorized from './../../site-wide/cta-widget/components/messages/mvi/NotAuthorized';
import NotFound from './../../site-wide/cta-widget/components/messages/mvi/NotFound';
import HealthToolsDown from './../../site-wide/cta-widget/components/messages/HealthToolsDown';

class RequiresMVI extends Component {
  render() {
    let mviError;
    const { loggedIn, mviStatus } = this.props;

    switch (mviStatus) {
      case 'NOT_FOUND':
        mviError = <NotFound />;
        break;
      case 'NOT_AUTHORIZED':
        mviError = <NotAuthorized />;
        break;
      case 'SERVER_ERROR':
        mviError = <HealthToolsDown />;
        break;
      default:
        break;
    }

    return (
      <>
        {loggedIn && mviError ? (
          <div className="vads-u-margin-bottom--1">{mviError}</div>
        ) : (
          ''
        )}
        {this.props.children}
      </>
    );
  }
}

RequiresMVI.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { status } = profile;
  return {
    loggedIn: isLoggedIn(state),
    mviStatus: status,
  };
};

export default connect(mapStateToProps)(RequiresMVI);
