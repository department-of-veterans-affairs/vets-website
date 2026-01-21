import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LocationType } from '../constants';

export class PaginationWrapper extends Component {
  shouldComponentUpdate = nextProps =>
    nextProps.results !== this.props.results ||
    nextProps.inProgress !== this.props.inProgress;

  render() {
    const {
      shouldRender,
      handlePageSelect,
      currentPage,
      totalPages,
      results,
    } = this.props;

    if (
      shouldRender &&
      currentPage &&
      totalPages > 1 &&
      results &&
      results.length > 0
    ) {
      return (
        <VaPagination
          uswds
          onPageSelect={handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
      );
    }
    return null;
  }
}

PaginationWrapper.propTypes = {
  currentPage: PropTypes.number,
  handlePageSelect: PropTypes.func,
  inProgress: PropTypes.bool,
  results: PropTypes.array,
  shouldRender: PropTypes.bool,
  totalPages: PropTypes.number,
};

const mapStateToProps = state => {
  let shouldHidePagination = false;

  // pagination not yet supported for PPMS urgent care
  if (
    state.searchQuery.facilityType === LocationType.URGENT_CARE &&
    (!state.searchQuery.serviceType ||
      ['AllUrgentCare', 'NonVAUrgentCare'].includes(
        state.searchQuery.serviceType,
      ))
  ) {
    shouldHidePagination = true;
  }

  return {
    shouldRender: !shouldHidePagination,
  };
};

export default connect(mapStateToProps)(PaginationWrapper);
