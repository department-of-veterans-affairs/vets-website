import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { Component } from 'react';

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
          onPageSelect={handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
      );
    }
    return null;
  }
}

export default PaginationWrapper;
