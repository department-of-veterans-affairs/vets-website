import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import Header from '../components/Header';
import InboxListView from '../components/InboxListView';

const App = props => {
  return (
    <RequiredLoginView
      user={props.user}
      serviceRequired={backendServices.MHV_AC}
    >
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <Header />
          <InboxListView />
        </div>
      </div>
    </RequiredLoginView>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

App.propTypes = {
  allMessages: PropTypes.object,
  getAllMessages: PropTypes.func,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(App);
