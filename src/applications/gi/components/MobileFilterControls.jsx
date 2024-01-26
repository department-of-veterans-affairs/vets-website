import React, { useState } from 'react';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import TuitionAndHousingEstimates from '../containers/TuitionAndHousingEstimates';
import FilterYourResults from '../containers/FilterYourResults';
// import FilterBeforeResults from '../containers/search/FilterBeforeResults';

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
      <button
        className="usa-button-secondary"
        onClick={tuitionAndHousingEstimatesClick}
      >
        Update tuition and housing estimates
      </button>
      <button className="usa-button-secondary" onClick={filterClick}>
        Filter your results
      </button>
      {tuitionAndHousingOpen && (
        <TuitionAndHousingEstimates
          smallScreen
          modalClose={closeTuitionAndHousingEstimates}
        />
      )}
      {filtersOpen &&
        environment.isProduction() && (
          <FilterYourResults smallScreen modalClose={closeFilters} />
        )}
      {filtersOpen &&
        !environment.isProduction() && (
          <FilterYourResults smallScreen modalClose={closeFilters} />
        )}
    </div>
  );
}
