import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import SearchControls from './SearchControls';
import { Link } from 'react-router';


class ResultsPane extends Component {
  renderResults() {
    const { facilities } = this.props;

    return (
      facilities.map(f => {
        return (
          <div key={f.id} className="facility-result">
            <h5>{f.name}</h5>
            <Link to={`facilities/facility/${f.id}`}>
              Facility details
            </Link>
          </div>
        );
      })
    );
  }

  render() {
    const { currentQuery, onSearch } = this.props;

    return (
      <div>
        <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={onSearch}/>
        <hr/>
        <div className="facility-search-results">
          <h4>Search Results:</h4>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
    facilities: state.facilities.facilities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPane);
