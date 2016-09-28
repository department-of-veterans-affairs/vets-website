import React, { Component, PropTypes } from 'react';
import SearchResult from './SearchResult';
import Pagination from '../../rx/components/Pagination';

class ResultsList extends Component {
  render() {
    const { facilities } = this.props;

    return (
      <div>
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
        <Pagination onPageSelect={() => {}} page={1} pages={1}/>
      </div>
    );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
};

export default ResultsList;
