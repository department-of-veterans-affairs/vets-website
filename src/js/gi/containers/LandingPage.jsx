import React from 'react';
import Router from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs';
import LandingPageForm from './LandingPageForm';

class LandingPage extends React.Component {

  renderPageTitle() {
    document.title = 'GI Bill Comparison Tool: Vets.gov';
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

  render() {
    this.renderPageTitle();
    return (
      <span className="landing-page-component">
        <div className="section">
          <Breadcrumbs/>
          {this.renderHeader()}
        </div>
        <div className="row">
          <LandingPageForm queryParams={this.props.queryParams}/>
        </div>
      </span>
    );
  }

}

LandingPage.propTypes = {
  queryParams: React.PropTypes.object.isRequired
};

export default LandingPage;
