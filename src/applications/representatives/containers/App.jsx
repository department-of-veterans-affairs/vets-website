import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import Dashboard from '../components/Dashboard';

function App({ user }) {
  return (
    <RequiredLoginView
      // TODO: Determine the significance of this flag for us.
      verify
      // TODO: Determine which services we require.
      serviceRequired={[]}
      user={user}
    >
      <div>
        <Dashboard />
      </div>
    </RequiredLoginView>
  );
}

App.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object,
};

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
export { App };
