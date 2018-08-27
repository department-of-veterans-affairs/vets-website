import React from 'react';
import { connect } from 'react-redux';

class SearchApp extends React.Component {
  render() {
    return (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Search App</h1>
          {JSON.stringify(this.props.search.results)}
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
};

const SearchAppContainer = connect(mapStateToProps, mapDispatchToProps)(SearchApp);

export default SearchAppContainer;
