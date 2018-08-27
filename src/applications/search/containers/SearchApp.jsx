import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchSearchResults
} from '../actions';

class SearchApp extends React.Component {
  static propTypes = {
    search: PropTypes.shape({
      results: PropTypes.array
    }).isRequired,
    fetchSearchResults: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Search App</h1>
          <h2>{JSON.stringify(this.props.search.results)}</h2>
          <button onClick={this.props.fetchSearchResults}>Fetch search results</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Map the state of the data store into props on our component
  const { search } = state;
  return {
    search
  };
}

const mapDispatchToProps = {
  fetchSearchResults
};

const SearchAppContainer = connect(mapStateToProps, mapDispatchToProps)(SearchApp);

export default SearchAppContainer;
