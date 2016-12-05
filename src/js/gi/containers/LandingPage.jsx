import React from 'react';
import Router from 'react-router';

import LandingPageForm from './LandingPageForm';

class LandingPage extends React.Component {

  render() {
    return (
      <span>
        <div className="section">
          {this.renderBreadcrumbs()}
          {this.renderHeader()}
        </div>
        <div className="row">
          <LandingPageForm queryParams={this.props.queryParams}/>
        </div>
      </span>
    );
  }

  renderHeader() {
    return (
      <div className="row">
        <div className="column">
          <h1 className="va-heading-sans">GI Bill Comparison Tool</h1>
        </div>
        <div className="small-12 medium-8 columns teaser-container">
          <h4 className="home-teaser">Learn about education programs and compare estimated benefits by school.</h4>
        </div>
      </div>
    );
  }

  renderBreadcrumbs() {
    return (
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
          <li><a href="/">Home</a></li>
          <li><a href="/education/">Education Benefits</a></li>
          <li><a href="/education/gi-bill/">GI Bill</a></li>
          <li className="active">GI Bill® Comparison Tool</li>
        </ul>
      </nav>
    );
  }

}

LandingPage.propTypes = {
  queryParams: React.PropTypes.object.isRequired
};

export default LandingPage;
