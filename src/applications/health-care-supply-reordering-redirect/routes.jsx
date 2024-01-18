import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Force a redirect since React Router's Redirect does not reload the page.
class CustomRedirect extends React.Component {
  constructor(props) {
    super(props);
    window.location.replace(props.url);
  }
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
