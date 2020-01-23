// Node modules.
import React, { Component } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
// Relative imports.
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';

class YellowRibbonApp extends Component {
  render() {
    return (
      <>
        {/* Breadcrumbs */}
        <Breadcrumbs>
          <a href="">Home</a>
          <a href="">Education and training</a>
          <a href="">Yellow Ribbon School Finder</a>
        </Breadcrumbs>

        <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-top--2p5 vads-u-padding-bottom--2p5">
          {/* Title */}
          <div className="vads-l-col">
            <h1>Search Yellow Ribbon Schools</h1>
          </div>

          <div className="vads-l-row">
            {/* Search Form */}
            <div className="vads-l-col--4">
              <p>
                The Yellow Ribbon benefit varies by school, the degree
                you&apos;re working toward, and the program or division
                you&apos;re studying in.
              </p>
              <SearchForm />
              <a href="">Learn more about the Yellow Ribbon Program.</a>
            </div>

            {/* Search Results */}
            <div className="vads-l-col--8">
              <SearchResults />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default YellowRibbonApp;
