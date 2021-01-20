import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
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
        <Pagination
          onPageSelect={handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  let isCommunityProviderSearch = false;

  if (
    [LocationType.CC_PROVIDER, LocationType.URGENT_CARE_PHARMACIES].includes(
      state.searchQuery.facilityType,
    )
  ) {
    isCommunityProviderSearch = true;
  }

  if (
    state.searchQuery.facilityType === LocationType.URGENT_CARE &&
    (!state.searchQuery.serviceType ||
      ['AllUrgentCare', 'NonVAUrgentCare'].includes(
        state.searchQuery.serviceType,
      ))
  ) {
    isCommunityProviderSearch = true;
  }

  return {
    shouldRender: !isCommunityProviderSearch,
  };
};

export default connect(mapStateToProps)(PaginationWrapper);
