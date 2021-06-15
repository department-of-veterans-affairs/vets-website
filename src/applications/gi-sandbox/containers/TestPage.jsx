import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { fetchSearchByLocationResults } from '../actions';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

export function TestPage({
  dispatchFetchSearchByLocationResults,
  filters,
  preview,
  search,
}) {
  const { inProgress } = search;
  const { count, results } = search.location;

  useEffect(() => {
    dispatchFetchSearchByLocationResults(
      'charleston',
      search.query.distance,
      filters,
      preview.version,
    );
  }, []);

  const resultCards = results.map((institution, index) => {
    return (
      <div key={index} className=" vads-u-width--full ">
        <div className="vads-u-width--full vads-u-background-color--primary-alt-light vads-u-margin--1">
          <div>{institution.name}</div>
          <div>
            <Checkbox label="Checkbox" onValueChange={() => {}} />
          </div>
        </div>
      </div>
    );
  });

  return (
    <span className="test-page">
      <div className="vads-u-min-height--viewport row">
        <div className={'location-search'}>
          <div className="clear-fix" />
          <div className={'usa-width-one-third'}>
            {!inProgress &&
              count > 0 && (
                <div className="location-search-results-container">
                  <div>{resultCards}</div>
                </div>
              )}
          </div>
          <div className={'usa-width-two-thirds'}>
            This space intentionally left blank
          </div>
        </div>
      </div>
    </span>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: state.filters,
  search: state.search,
  preview: state.preview,
});

const mapDispatchToProps = {
  dispatchFetchSearchByLocationResults: fetchSearchByLocationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestPage);
