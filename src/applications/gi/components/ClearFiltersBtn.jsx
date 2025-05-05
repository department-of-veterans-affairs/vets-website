import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { filterChange } from '../actions';

function ClearFiltersBtn({
  filters,
  dispatchFilterChange,
  onKeyDown,
  onClick,
  className,
}) {
  const clearAllFilters = () => {
    dispatchFilterChange({
      ...filters,
      schools: true,
      excludedSchoolTypes: [
        'PUBLIC',
        'FOR PROFIT',
        'PRIVATE',
        'FOREIGN',
        'FLIGHT',
        'CORRESPONDENCE',
        'HIGH SCHOOL',
      ],
      excludeCautionFlags: false,
      accredited: false,
      studentVeteran: false,
      yellowRibbonScholarship: false,
      employers: true,
      vettec: false,
      preferredProvider: false,
      country: 'ALL',
      state: 'ALL',
      specialMissionHbcu: false,
      specialMissionMenonly: false,
      specialMissionWomenonly: false,
      specialMissionRelaffil: false,
      specialMissionHSI: false,
      specialMissionNANTI: false,
      specialMissionANNHI: false,
      specialMissionAANAPII: false,
      specialMissionPBI: false,
      specialMissionTRIBAL: false,
    });
    if (onClick) {
      onClick();
    }
  };
  return (
    <>
      <VaButton
        secondary
        text="Reset search"
        className={className}
        onClick={clearAllFilters}
        onKeyDown={onKeyDown}
        data-testid="clear-button"
      />
    </>
  );
}
const mapStateToProps = state => ({
  filters: state.filters,
});

const mapDispatchToProps = {
  dispatchFilterChange: filterChange,
};
ClearFiltersBtn.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  closeAndUpdate: PropTypes.func,
  dispatchFilterChange: PropTypes.func,
  filters: PropTypes.object,
  smallScreen: PropTypes.bool,
  title: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(ClearFiltersBtn);
