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
        <a onClick={() => {this.props.onPageSelect(this.props.page + 1);}}>
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
        <a onClick={() => {this.props.onPageSelect(this.props.page - 1);}}>
          <abbr title="Previous">Prev</abbr>
        </a>
      );
    }
    return prevPage;
  }

  pageNumbers(limit) {
    const totalPages = this.props.pages;
    // If there are more pages returned than the limit to show
    // cap the upper range at limit + the page number.
    const end = (totalPages > limit) ? (limit + this.props.page) : totalPages;

    return range(this.props.page, end);
  }

  render() {
    if (this.props.pages === 1) {
      return <div/>;
    }

    const pageList = this.pageNumbers(10).map((e) => {
      const pageClass = classNames({
        'va-pagination-active': this.props.page === e
      });

      return (
        <a
            key={e}
            className={pageClass}
            onClick={() => this.props.onPageSelect(e)}>
          {e}
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
