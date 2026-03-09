import React, { useRef } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SearchResultsHeader from './SearchResultsHeader';
import ResultsList from './ResultsList';
import PaginationWrapper from './PaginationWrapper';
import { clearError } from '../../actions';
import { ErrorTypes } from '../../constants';

const ResultsSection = ({ isLoading, isDisplayingResults, onPageSelect }) => {
  const dispatch = useDispatch();
  const currentQuery = useSelector(state => state.currentQuery);
  const errors = useSelector(state => state.errors);
  const { isErrorFetchRepresentatives, isErrorReportSubmission } = errors;

  const searchResultTitleRef = useRef(null);

  if (
    isLoading &&
    !isErrorFetchRepresentatives &&
    currentQuery.searchCounter > 0
  )
    return (
      <div className="row results-section">
        <div className="loading-indicator-container">
          <va-loading-indicator
            label="Searching"
            message="Searching for representatives..."
            set-focus
          />
        </div>
      </div>
    );
  return (
    <div className="row results-section">
      <VaModal
        modalTitle="Were sorry, something went wrong"
        message="Please try again soon."
        onCloseEvent={() =>
          dispatch(clearError(ErrorTypes.reportSubmissionError))
        }
        visible={isErrorReportSubmission}
        status="error"
        uswds
      >
        <p>Please try again soon.</p>
      </VaModal>

      <div id="search-results-title" ref={searchResultTitleRef}>
        {isDisplayingResults &&
          !isErrorFetchRepresentatives && (
            <>
              <SearchResultsHeader />
              <ResultsList />
              <PaginationWrapper handlePageSelect={onPageSelect} />
            </>
          )}
      </div>
    </div>
  );
};

ResultsSection.propTypes = {
  isDisplayingResults: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onPageSelect: PropTypes.func.isRequired,
};

export default ResultsSection;
