import React from 'react';
import classNames from 'classnames';
import range from 'lodash/fp/range';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.last = this.last.bind(this);
    this.pageNumbers = this.pageNumbers.bind(this);
  }

  next() {
    let nextPage;
    if (this.props.pages > this.props.page) {
      nextPage = (
        <a aria-label="Next page" onClick={() => {this.props.onPageSelect(this.props.page + 1);}}>
          Next
        </a>
      );
    }
    return nextPage;
  }

  prev() {
    let prevPage;
    if (this.props.page > 1) {
      prevPage = (
        <a aria-label="Previous page" onClick={() => {this.props.onPageSelect(this.props.page - 1);}}>
          <abbr title="Previous">Prev</abbr>
        </a>
      );
    }
    return prevPage;
  }

  last() {
    let lastPage;
    if (this.props.showLastPage && this.props.page < this.props.pages - this.props.maxPageListLength + 2) {
      lastPage = (
        <span>
          <a aria-label="...">
            ...
          </a>
          <a aria-label="Last page" onClick={() => {this.props.onPageSelect(this.props.pages);}}>
            {this.props.pages}
          </a>
        </span>
      );
    }
    return lastPage;
  }

  pageNumbers(limit) {
    const totalPages = this.props.pages;
    const currentPage = this.props.page;
    let end;
    let start;

    // If there are more pages returned than the limit to show
    // cap the upper range at limit + the page number.
    if (totalPages > limit) {
      start = currentPage;
      end = limit + currentPage;
      // treat the last pages specially
      if (start >= totalPages - limit) {
        start = totalPages - limit;
        end = totalPages + 1;
      }
    } else {
      start = 1;
      end = totalPages + 1;
    }

    return range(start, end);
  }

  render() {
    if (this.props.pages === 1) {
      return <div/>;
    }

    let pageListMax = this.props.maxPageListLength;
    if (this.props.showLastPage) {
      pageListMax -= 2;
    }

    const pageList = this.pageNumbers(pageListMax).map((pageNumber) => {
      const pageClass = classNames({
        'va-pagination-active': this.props.page === pageNumber
      });

      return (
        <a
            key={pageNumber}
            className={pageClass}
            aria-label={`Page ${pageNumber}`}
            onClick={() => this.props.onPageSelect(pageNumber)}>
          {pageNumber}
        </a>
      );
    });

    return (
      <div className="va-pagination">
        <span className="va-pagination-prev">{this.prev()}</span>
        <div className="va-pagination-inner">
          {pageList} {this.last()}
        </div>
        <span className="va-pagination-next">{this.next()}</span>
      </div>
    );
  }
}

Pagination.propTypes = {
  onPageSelect: React.PropTypes.func.isRequired,
  page: React.PropTypes.number.isRequired,
  pages: React.PropTypes.number.isRequired,
  maxPageListLength: React.PropTypes.number.isRequired,
  showLastPage: React.PropTypes.bool,
};

Pagination.defaultProps = {
  maxPageListLength: 10,
};

export default Pagination;
