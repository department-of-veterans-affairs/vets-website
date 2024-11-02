import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { filterChange } from '../actions';

function ClearFiltersBtn({
  filters,
  dispatchFilterChange,
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
    onClick();
  };
  return (
    <>
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
      {/* <button
        className="clear-filters-btn"
        onClick={clearAllFilters}
        data-testid={testId}
        onKeyDown={onKeyDown}
      > */}
      <VaButton
        text="Reset search"
        secondary
        // className="apply-filter-button"
        onClick={clearAllFilters}
        onKeyDown={onKeyDown}
        data-testid={testId}
      >
        {' '}
        {children}
      </VaButton>
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
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClearFiltersBtn);
