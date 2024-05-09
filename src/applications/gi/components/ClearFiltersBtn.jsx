import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isProductionOrTestProdEnv } from '../utils/helpers';
import { filterChange } from '../actions';

function ClearFiltersBtn({
  filters,
  dispatchFilterChange,
  smallScreen,
  children,
  testId,
  onKeyDown,
  onClick,
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
      vettec: true,
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
    onClick();
  };
  return (
    <>
      {isProductionOrTestProdEnv() ? (
        <button
          className="clear-filters-btn"
          onClick={clearAllFilters}
          data-testid={testId}
          onKeyDown={onKeyDown}
        >
          {' '}
          {children}
        </button>
      ) : (
        <button
          onClick={clearAllFilters}
          className={
            smallScreen
              ? 'clear-filters-button mobile-clear-filter-button'
              : 'clear-filters-button'
          }
        >
          {children}
        </button>
      )}
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
  closeAndUpdate: PropTypes.func,
  dispatchFilterChange: PropTypes.func,
  filters: PropTypes.object,
  smallScreen: PropTypes.bool,
  testId: PropTypes.string,
  title: PropTypes.string,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClearFiltersBtn);
