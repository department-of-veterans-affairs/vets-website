import React from 'react';
import { useFeatureToggle } from '@department-of-veterans-affairs/platform-utilities';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SearchControls from './SearchControls';

const SearchSection = ({ onSearch }) => {
  const isErrorFetchRepresentatives = useSelector(
    state => state.errors.isErrorFetchRepresentatives,
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const widgetEnabled = useToggleValue(
    TOGGLE_NAMES.representativeStatusEnabled,
  );
  return (
    <div className="row search-section">
      <div className="title-section">
        <h1>Find a VA accredited representative or VSO</h1>
        <p>
          An accredited attorney, claims agent, or Veterans Service Organization
          (VSO) representative can help you file a claim or request a decision
          review. Use our search tool to find one of these types of accredited
          representatives to help you.
        </p>
        <p>
          <strong>Note:</strong> You’ll need to contact the accredited
          representative you’d like to appoint to make sure they’re available to
          help you.
        </p>
      </div>

      {widgetEnabled && (
        <>
          <div tabIndex="-1">
            <div data-widget-type="representative-status" />
          </div>
        </>
      )}

      <SearchControls onSubmit={onSearch} />

      {isErrorFetchRepresentatives && (
        <div className="vads-u-margin-y--3">
          <va-alert
            close-btn-aria-label="Close notification"
            status="error"
            uswds
            visible
          >
            <h2 slot="headline">We’re sorry, something went wrong</h2>
            <React.Fragment key=".1">
              <p className="vads-u-margin-y--0">Please try again soon.</p>
            </React.Fragment>
          </va-alert>
        </div>
      )}
    </div>
  );
};

SearchSection.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchSection;
