// Node modules.
import React, { Component } from 'react';
// Relative imports.
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';

class YellowRibbonApp extends Component {
  render() {
    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-top--2p5 vads-u-padding-bottom--2p5">
        <div className="vads-l-col">
          <h1>Yellow Ribbon School Finder</h1>
          <p>
            Yellow Ribbon funding is an additional benefit you can receive if
            you qualify for the Post-9/11 GI Bill Education funding benefit.
          </p>
          <p>
            Participation varies by school, degree, and the program or division
            you apply to. Start your search here.
          </p>
        </div>

        <div className="vads-l-row">
          {/* Search Form */}
          <div className="vads-l-col--4">
            <SearchForm />
          </div>

          {/* Search Results */}
          <div className="vads-l-col--8">
            <SearchResults />
          </div>
        </div>

        <div className="vads-l-col">
          <h2>Learn More about the YR Program</h2>
          <p>Links back to YR content page.</p>
        </div>
      </div>
    );
  }
}

export default YellowRibbonApp;
