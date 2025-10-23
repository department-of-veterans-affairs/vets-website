import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import TuitionAndHousingEstimates from '../containers/TuitionAndHousingEstimates';
import FilterYourResults from '../containers/FilterYourResults';

export default function MobileFilterControls({ className }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tuitionAndHousingOpen, setTuitionAndHousingOpen] = useState(false);

  const filterClick = () => {
    if (!filtersOpen) {
      document.body.classList.add('modal-open');
      recordEvent({
        event: 'int-accordion-expand',
      });
    }
    setFiltersOpen(!filtersOpen);
  };

  const tuitionAndHousingEstimatesClick = () => {
    if (!tuitionAndHousingOpen) {
      recordEvent({
        event: 'int-accordion-expand',
      });
      document.body.classList.add('modal-open');
    }
    setTuitionAndHousingOpen(!tuitionAndHousingOpen);
  };

  const closeFilters = () => {
    setFiltersOpen(false);
    document.body.classList.remove('modal-open');
  };

  const closeTuitionAndHousingEstimates = () => {
    setTuitionAndHousingOpen(false);
    document.body.classList.remove('modal-open');
  };

  return (
    <div
      className={classNames(
        'vads-u-margin-left--1 vads-u-margin-right--1',
        className,
      )}
    >
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
      <button
        className="usa-button-secondary"
        onClick={tuitionAndHousingEstimatesClick}
      >
        Update tuition, housing, and monthly benefit estimates
      </button>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
      <button className="usa-button-secondary" onClick={filterClick}>
        Filter your results
      </button>
      {tuitionAndHousingOpen && (
        <TuitionAndHousingEstimates
          smallScreen
          modalClose={closeTuitionAndHousingEstimates}
        />
      )}
      {filtersOpen && (
        <FilterYourResults smallScreen modalClose={closeFilters} />
      )}
    </div>
  );
}
MobileFilterControls.propTypes = {
  className: PropTypes.string,
};
