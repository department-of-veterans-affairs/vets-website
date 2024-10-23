import React from 'react';

const MedicationsListFilter = () => {
  return (
    <va-accordion open-single data-testid="filter-accordion">
      <va-accordion-item header="Filter" id="filter">
        <span slot="icon">
          <va-icon aria-hidden="true" icon="filter_alt" />
        </span>
      </va-accordion-item>
    </va-accordion>
  );
};

export default MedicationsListFilter;
