import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults } from '../../actions';
import SearchRepresentativeResult from './searchRepresentativeResult';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { chunk } from 'lodash';

const SearchRepresentativeWidget = props => {
  const { loading, representatives, formData } = props;
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPerPage] = useState(3);
  const [currentlyShowingData, setCurrentlyShowingData] = useState([]);
  const [paginatedData, setPaginatedData] = useState(null);

  // when the page loads, load the initial data set from props into the list
  function handleLoadData() {
    // Creates an array of arrays of the data passed in as props
    // in this shape [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]]
    const chunkedData = chunk(representatives, maxPerPage);
    setCurrentlyShowingData(chunkedData[0]);
    setPaginatedData(chunkedData);
    setPages(chunkedData.length);
  }

  const handleClick = value => {
    const updatedFormData = {
      ...formData,
      preferredRepresentative: value,
    };
    props.setData(updatedFormData);
  };

  const handleDataPagination = page => {
    setCurrentlyShowingData(paginatedData[page - 1]);
    setCurrentPage(page);
  };

  useEffect(
    function() {
      props.fetchRepresentativeSearchResults();
      handleLoadData();
    },
    [loading],
  );

  if (loading) {
    return <div>Loading...</div>;
  } else if (representatives.length > 0) {
    return (
      <div className="vads-u-border-top--1px vads-u-border-color--gray-light">
        {currentlyShowingData?.map(option => {
          return (
            <>
              <SearchRepresentativeResult
                option={option}
                handleClick={handleClick}
                key={option.id}
              />
            </>
          );
        })}
        <Pagination
          onPageSelect={page => handleDataPagination(page)}
          page={currentPage}
          pages={pages}
        />
      </div>
    );
  } else {
    return <div>No results</div>;
  }
};

const mapDispatchToProps = {
  setData,
  fetchRepresentativeSearchResults,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
    representatives: state.allSearchResults.representativeSearchResults,
    loading: state.allSearchResults.loading,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRepresentativeWidget);
