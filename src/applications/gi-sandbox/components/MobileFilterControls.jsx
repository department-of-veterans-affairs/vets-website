import React, { useState } from 'react';
import { TABS } from '../constants';
import classNames from 'classnames';
import TuitionAndHousingEstimates from '../containers/TuitionAndHousingEstimates';
import FilterYourResults from '../containers/FilterYourResults';

export default function MobileFilterControls({ tab }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tuitionAndHousingOpen, setTuitionAndHousingOpen] = useState(false);

  const filterClick = () => {
    if (!filtersOpen) {
      document.body.classList.add('modal-open');
    }

    setFiltersOpen(!filtersOpen);
  };

  const tuitionAndHousingEstimatesClick = () => {
    if (!tuitionAndHousingOpen) {
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
      className={classNames('vads-u-margin-left--1 vads-u-margin-right--1', {
        'vads-u-margin-top--2': tab !== TABS.location,
      })}
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
      {filtersOpen && (
        <FilterYourResults smallScreen modalClose={closeFilters} />
      )}
    </div>
  );
}
