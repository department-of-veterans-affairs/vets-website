import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
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

    let userInputFromAddress = '';
    if (this.props.router.location.query) {
      userInputFromAddress = this.props.router.location.query.term;
    }

    this.state = {
      userInput: userInputFromAddress
    };
  }

  componentDidMount() {
    // If there's data in userInput, it must have come from the address bar, so we immediately hit the API.
    if (this.state.userInput) {
      this.props.fetchSearchResults(this.state.userInput);
    }
  }

  handleInputChange = (event) => {
    this.setState({
      userInput: event.target.value
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const userInput = this.state.userInput;
    // @todo figure out how to sychronize the term in the search bar with the value being submitted, so that the search results are bookmarkable.
    // this.props.router.location.query.term = encodeURIComponent(userInput);
    this.props.fetchSearchResults(userInput);
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

const SearchAppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchApp));

export default SearchAppContainer;
