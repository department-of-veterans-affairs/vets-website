import React from 'react';
import { features } from '../../../common/containers/BetaApp';
import { connect } from 'react-redux';

class DashboardRedirect extends React.Component {

  static defaultProps = {
    services: []
  };

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
    // @todo It would be cool if could instead:
    // Push /dashboard-beta into the browser history without a reload
    // Import a Dashboard entry function that we can execute to render to the page.
    // That would save us a weird reload.

    // @todo Also, it would be great if we could cache a flag to sessionStorage to know to
    // render the dashboard instead of the homepage. That way we could check that flag and render immediately
    // instead of waiting for the user object to come back with the list of services.

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
