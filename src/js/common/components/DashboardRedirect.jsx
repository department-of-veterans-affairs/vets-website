import React from 'react';
import { features } from '../containers/BetaApp';

class DashboardRedirect extends React.Component {

  static defaultProps = {
    services: []
  };

  componentWillMount() {
    // Create a global event listener...
    document.addEventListener('mousedown', event => {

      // So that when a link to the homepage is clicked...
      if (event.target.tagName.toLowerCase() === 'a' && event.target.pathname === '/') {

        // And the user is registered for the beta
        if (this.userIsRegisteredForBeta()) {
          event.preventDefault();
          event.stopPropagation();

          // They are redirected instead to the dashboard -
          this.redirectToDashboard();
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // If the user is on the index page without the "next" parameter in the URL...
    if (window.location.pathname === '/' && !window.location.search) {

      // And we receive new services data (like after a login)...
      if (nextProps.services !== this.props.services) {

        // And the services data contains the dashboard....
        if (this.userIsRegisteredForBeta(nextProps.services)) {

          // Then go to the dashboard -
          this.redirectToDashboard();
        }
      }
    }
  }

  redirectToDashboard() {
    window.location.pathname = '/dashboard-beta';
  }

  userIsRegisteredForBeta(services = this.props.services) {
    return services.includes(features.personalization);
  }

  render() {
    return <div></div>;
  }
}

export default DashboardRedirect;
