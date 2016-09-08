import React, { Component } from 'react';
import SearchControls from './SearchControls';

class ResultsPane extends Component {
  render() {
    return (
      <div>
        <SearchControls/>
        <hr/>
        <h4>Search Results:</h4>
      </div>
    );
  }
}

export default ResultsPane;
