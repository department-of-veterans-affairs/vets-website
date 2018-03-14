import React from 'react';

class DashboardRedirect extends React.Component {

  componentDidMount() {
    // If when this component is mounted the user is on the index page without the "next" parameter in the URL...
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
    if (event.target.tagName.toLowerCase() === 'a' && event.target.pathname === '/') {
      event.preventDefault();
      event.stopPropagation();

      this.redirectToDashboard();
    }
  }

  redirectToDashboard() {
    window.location.replace('/dashboard-beta');
  }

  render() {
    return <span></span>;
  }
}

export default DashboardRedirect;
