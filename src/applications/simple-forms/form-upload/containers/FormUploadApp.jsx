import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

function FormUploadApp({ user }) {
  useEffect(() => {
    document.title = 'Form Upload | Veterans Affairs';
  }, []);

  return (
    <RequiredLoginView user={user} serviceRequired={[]}>
      <Outlet />
    </RequiredLoginView>
  );
}

FormUploadApp.propTypes = {
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(FormUploadApp);

export { FormUploadApp };
