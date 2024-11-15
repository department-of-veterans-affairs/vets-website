import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
      <VaButton
        text="Update tuition, housing, and monthly benefit estimates"
        className="accordion-mob-btns"
        data-testid="tuition-housing-ben"
        secondary
        onClick={tuitionAndHousingEstimatesClick}
      />
      <VaButton
        text="Filter your results"
        className="vads-u-margin-top--2 vads-u-width--full"
        secondary
        onClick={filterClick}
        data-testid="update-results-small-screen"
      />
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
