import React from 'react';
import classNames from 'classnames';
import range from 'lodash/fp/range';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
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

  pageNumbers(limit) {
    const totalPages = this.props.pages;
    let end;
    let start;

    if (totalPages > limit) {
      // If there are more pages returned than the limit to show
      // cap the upper range at limit + the page number.
      start = this.props.page;
      end = limit + this.props.page;
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

    const pageList = this.pageNumbers(10).map((pageNumber) => {
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
          {pageList}
        </div>
        <span className="va-pagination-next">{this.next()}</span>
      </div>
    );
  }
}

Pagination.propTypes = {
  onPageSelect: React.PropTypes.func.isRequired,
  page: React.PropTypes.number.isRequired,
  pages: React.PropTypes.number.isRequired
};

export default Pagination;
