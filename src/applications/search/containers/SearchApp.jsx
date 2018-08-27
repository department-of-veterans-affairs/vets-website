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

  constructor(props) {
    super(props);
    this.state = {
      userInput: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      userInput: event.target.value
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.props.fetchSearchResults(this.state.userInput);
  }

  render() {
    return (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Search App</h1>
          <form onSubmit={this.handleFormSubmit}>
            <input type="text" name="query" value={this.state.userInput} onChange={this.handleInputChange}/>
            <button type="submit">Fetch search results</button>
          </form>
          <h2>{JSON.stringify(this.props.search.results)}</h2>
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
