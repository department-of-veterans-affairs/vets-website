import React from 'react';

class DashboardRedirect extends React.Component {

  componentDidMount() {
    // If the user is on the index page without the "next" parameter in the URL...
    if (window.location.pathname === '/' && !window.location.search) {
      this.redirectToDashboard();
    } else {
      document.addEventListener('mousedown', this.checkLink);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.checkLink);
  }

  checkLink = (event) => {
    // When a link to the homepage is clicked...
    if (event.target.tagName.toLowerCase() === 'a' && event.target.pathname === '/') {

      // And the user is registered for the beta
      event.preventDefault();
      event.stopPropagation();

      // They are redirected instead to the dashboard -
      this.redirectToDashboard();
    }
  }

  redirectToDashboard() {
    window.location.pathname = '/dashboard-beta';
  }

  render() {
    return <span></span>;
  }
}

export default DashboardRedirect;
