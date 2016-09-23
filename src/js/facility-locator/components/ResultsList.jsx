import React, { Component, PropTypes } from 'react';
import SearchResult from './SearchResult';


class ResultsList extends Component {
  render() {
    const { facilities } = this.props;

    return (
      <ol>
        {
          facilities.map(f => {
            return (
              <li key={f.id}>
                <SearchResult facility={f}/>
              </li>
            );
          })
        }
      </ol>
    );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
};

export default ResultsList;
