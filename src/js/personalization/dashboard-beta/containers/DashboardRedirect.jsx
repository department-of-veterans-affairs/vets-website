import React from 'react';
// import { Route, IndexRedirect, Redirect } from 'react-router';
import { features } from '../../../common/containers/BetaApp';
import { connect } from 'react-redux';

class DashboardRedirect extends React.Component {

  static defaultProps = {
    services: []
  };

  constructor(props) {
    super(props);
    this.state = { shouldRedirect: false };
  }

  componentWillMount() {
    this.checkURL();
  }

  componentDidUpdate() {
    this.checkURL();
  }

  redirectToDashboard() {
    window.location.pathname = '/dashboard-beta';
  }

  userIsRegisteredForBeta(services = this.props.services) {
    return services.includes(features.personalization);
  }

  checkURL = () => {
    // If the user is on the index page without the "next" parameter in the URL...
    if (window.location.pathname === '/' && !window.location.search) {

      // And the services data contains the dashboard....
      if (this.userIsRegisteredForBeta()) {

        // Then go to the dashboard -
        this.redirectToDashboard();
      }
    }
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => {
  return {
    services: state.user.profile.services
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRedirect);
