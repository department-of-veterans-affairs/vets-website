// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import { selectProfile } from 'platform/user/selectors';
import {
  deriveLOA1URL,
  deriveLOA2PlusURL,
  deriveDefaultURL,
} from '../../helpers';

export const App = ({ loa }) => {
  const deriveURL = () => {
    if (loa === 1) {
      return deriveLOA1URL();
    }

    if (loa >= 2) {
      return deriveLOA2PlusURL();
    }

    return deriveDefaultURL();
  };

  return (
    <a href={deriveURL()} rel="noreferrer noopener">
      Contact us online through Ask VA
    </a>
  );
};

App.propTypes = {
  // From mapStateToProps.
  loa: PropTypes.number,
};

const mapStateToProps = state => ({
  loa: selectProfile(state)?.loa?.current,
});

export default connect(
  mapStateToProps,
  null,
)(App);
