import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults } from '../../actions';
import SearchRepresentativeResult from './searchRepresentativeResult';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { chunk } from 'lodash';

const SearchRepresentativeWidget = props => {
  const { loading, representatives, formData } = props;
  const maxPerPage = 3;
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
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
      <div>
        <p>
          Please speak to the service organization or representative before you
          send your request. You’ll need to mail it to your nearest VA regional
          office or to the service organization or representative that is going
          to help you.
        </p>
        {currentlyShowingData?.map(option => {
          return (
            <SearchRepresentativeResult
              option={option}
              handleClick={handleClick}
              key={option.id}
            />
          );
        })}
        <Pagination
          onPageSelect={page => handleDataPagination(page)}
          page={currentPage}
          pages={pages}
        />
        <h2>If you don’t see the representative you want</h2>
        <p>You can go back to make changes and search again.</p>
        <a
          className="vads-c-action-link--green"
          href="/view-change-representative/search/representative-type"
        >
          Go back and search again
        </a>
        <h2>If you found the representative you want</h2>
        <p>
          If you find a representative you want to help you, contact them by
          phone, email or mail first to be sure they’re available. If you don’t
          see the representative you want, you can go back to make changes and
          search again.
        </p>
        <h3>Contact the representative you want to help you</h3>
        <p>
          When you find a VSO or representative you want to help you, contact
          them first by phone, mail or email to be sure they’re available.
        </p>
        <h3>Let VA know</h3>
        <p>
          When you know a VSO or representative is available to help you, there
          are several ways to make it official.
        </p>
        <ul>
          <li>
            <p>
              To have a VSO help you, fill out an Appointment of Veterans
              Service Organization as Claimant’s Representative (VA Form 21-22).
            </p>
            <p>
              <i
                className="fas fa-download vads-u-padding-right--1 vads-u-color--link-default"
                aria-hidden="true"
              />
              <a
                className="vads-u-color--link-default"
                href="/find-forms/about-form-21-22/"
              >
                Download VA form 21-22 (PDF)
              </a>
            </p>
          </li>
          <li>
            <p>
              To have a claims agent or attorney help you, fill out an
              Appointment of Individual as Claimant’s Representative (VA Form
              21-22a).
            </p>
            <p>
              <i
                className="fas fa-download vads-u-padding-right--1 vads-u-color--link-default"
                aria-hidden="true"
              />
              <a
                className="vads-u-color--link-default"
                href="/find-forms/about-form-21-22/"
              >
                Download VA form 21-22a (PDF)
              </a>
            </p>
            <p>
              Please speak to the service organization or representative before
              you send your request. If you’re filling out one of the forms,
              you’ll need to mail it to your nearest VA regional office.
            </p>
            <a href="/find-locations/">Find a VA regional office near you</a>
          </li>
        </ul>
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
