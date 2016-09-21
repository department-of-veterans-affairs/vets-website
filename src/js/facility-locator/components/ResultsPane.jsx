import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import SearchControls from './SearchControls';
import { Link } from 'react-router';
import { compact } from 'lodash';


class ResultsPane extends Component {


  // TODO (bshyong): refactor this method to use a FacilitySearchResult component
  renderResults() {
    const { facilities } = this.props;

    return (
      facilities.map(f => {
        const { address } = f.attributes;

        return (
          <li key={f.id} className="facility-result">
            <Link to={`facilities/facility/${f.id}`}>
              <h5>{f.name}</h5>
            </Link>
            <strong>Facility type: {f.type}</strong>
            <p>
              {compact([address.building, address.street, address.suite].join(' '))}<br/>
              {`${address.city}, ${address.state} ${address.zip}-${address.zip4}`}
            </p>
          </li>
        );
      })
    );
  }

  render() {
    const { currentQuery, onSearch, maxHeight } = this.props;

    return (
      <div style={{ maxHeight, overflowY: 'auto' }}>
        <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={onSearch}/>
        <hr className="light"/>
        <div className="facility-search-results">
          <h4>Search Results:</h4>
          <ol>
            {this.renderResults()}
          </ol>
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
