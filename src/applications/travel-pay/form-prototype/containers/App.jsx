import React from 'react';
import PropTypes from 'prop-types';

const App = () => {
  return <div>Hello There</div>;
};

App.propTypes = {
  identityVerified: PropTypes.bool,
  user: PropTypes.object,
};

export default App;
