import React from 'react';

import AdditionalResources from '../components/AdditionalResources';


class ProfilePage extends React.Component {

  render() {
    return (
      <span>
        {this.renderHeader()}
        <div className="row">
          <div className="small-12 medium-8 columns">
            <h2>ProfilePage</h2>
          </div>

          <div className="small-12 medium-4 columns">
            <AdditionalResources/>
          </div>
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

}

export default ProfilePage;
