import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Force a redirect since React Router's Redirect does not reload the page.
function CustomRedirect({ url }) {
  window.location.replace(url);
}

CustomRedirect.propTypes = {
  url: PropTypes.string,
};

const route = (
  <Route>
    <CustomRedirect url="/health-care/order-hearing-aid-or-CPAP-supplies-form" />
  </Route>
);

export default route;
