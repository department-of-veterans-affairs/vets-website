import React, { useCallback, useEffect, useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setData as _setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults as _fetchResults } from '../../../actions';
import SearchRepresentativeResult from './searchRepresentativeResult';

const SearchRepresentativeWidget = ({
  fetchRepresentativeSearchResults,
  formData,
  loading,
  representatives,
  setData,
}) => {
  const maxPerPage = 3;
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentlyShowingData, setCurrentlyShowingData] = useState([]);
  const [paginatedData, setPaginatedData] = useState(null);

  // when the page loads, load the initial data set from props into the list
  const handleLoadData = useCallback(
    () => {
      // Creates an array of arrays of the data passed in as props
      // in this shape [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]]
      const chunkedData = chunk(representatives, maxPerPage);
      setCurrentlyShowingData(chunkedData[0]);
      setPaginatedData(chunkedData);
      setPages(chunkedData.length);
    },
    [representatives],
  );

  const handleClick = useCallback(
    preferredRepresentative => {
      const updatedFormData = {
        ...formData,
        preferredRepresentative,
      };

      setData(updatedFormData);
    },
    [formData, setData],
  );

  const handleDataPagination = useCallback(
    page => {
      setCurrentlyShowingData(paginatedData[page - 1]);
      setCurrentPage(page);
    },
    [paginatedData],
  );

  useEffect(
    () => {
      fetchRepresentativeSearchResults();
    },
    [fetchRepresentativeSearchResults],
  );

  useEffect(
    () => {
      handleLoadData();
    },
    [handleLoadData],
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (representatives.length > 0) {
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
              key={option.id}
              handleClick={handleClick}
              option={option}
            />
          );
        })}
        <VaPagination
          onPageSelect={e => handleDataPagination(e.detail.page)}
          page={currentPage}
          pages={pages}
        />

        <h2>If the accredited representative you want isn’t listed here</h2>
        <p>
          You can go back to try your search again. Try entering a different
          kind of representative or a different location.
        </p>
        <a
          className="vads-c-action-link--green"
          href="/view-change-representative/search/representative-type"
        >
          Go back to search again
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
              <a
                className="vads-u-color--link-default"
                href="/find-forms/about-form-21-22/"
              >
                <i
                  className="fas fa-download vads-u-padding-right--1 vads-u-color--link-default"
                  aria-hidden="true"
                />
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
              <a
                className="vads-u-color--link-default"
                href="/find-forms/about-form-21-22/"
              >
                <i
                  className="fas fa-download vads-u-padding-right--1 vads-u-color--link-default"
                  aria-hidden="true"
                />
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
  }
  return (
    <>
      <h2>We didn’t find a match</h2>
      <p>
        You can go back to try your search again. Try entering a different kind
        of representative or a different location.
      </p>
      <a
        className="vads-c-action-link--green"
        href="/view-change-representative/search/representative-type"
      >
        Go back to search again
      </a>
    </>
  );
};

const mapDispatchToProps = {
  setData: _setData,
  fetchRepresentativeSearchResults: _fetchResults,
};

function mapStateToProps(state) {
  return {
    representatives: state.allSearchResults.representativeSearchResults,
    loading: state.allSearchResults.loading,
  };
}

SearchRepresentativeWidget.propTypes = {
  fetchRepresentativeSearchResults: PropTypes.func,
  formData: PropTypes.object,
  loading: PropTypes.bool,
  representatives: PropTypes.array,
  setData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRepresentativeWidget);
