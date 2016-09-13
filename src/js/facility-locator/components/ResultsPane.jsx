import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import SearchControls from './SearchControls';

class ResultsPane extends Component {
  render() {
    const { currentQuery } = this.props;

    return (
      <div>
        <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery}/>
        <hr/>
        <h4>Search Results:</h4>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPane);
