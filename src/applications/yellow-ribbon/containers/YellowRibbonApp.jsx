// Node modules.
import React, { Component } from 'react';
// Relative imports.
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

class YellowRibbonApp extends Component {
  render() {
    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <div className="vads-l-row">
          <SearchForm />
          <SearchResults />
        </div>
      </div>
    );
  }
}

export default YellowRibbonApp;
