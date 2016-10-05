import React from 'react';
import classNames from 'classnames';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.selectNext = this.selectNext.bind(this);
    this.selectPrev = this.selectPrev.bind(this);
  }

  selectNext() {
    if (this.props.page < this.props.pages) {
      this.props.onPageSelect(this.props.page + 1);
    }
  }

  selectPrev() {
    if (this.props.page > 1) {
      this.props.onPageSelect(this.props.page - 1);
    }
  }

  render() {
    const pageList = Array(this.props.pages).fill().map((e, i) => {
      const pageNumber = i + 1;
      const pageClass = classNames({
        'va-pagination-active': this.props.page === pageNumber
      });

      return (
        <a
            key={pageNumber}
            className={pageClass}
            onClick={() => this.props.onPageSelect(pageNumber)}>
          {pageNumber}
        </a>
      );
    });

    const prevPage = (
      <a className="va-pagination-prev" onClick={this.selectPrev}>
        <abbr title="Previous">Prev</abbr>
      </a>
    );

    const nextPage = (
      <a className="va-pagination-next" onClick={this.selectNext}>
        Next
      </a>
    );

    return (
      <div className="va-pagination">
        <div className="va-pagination-inner">
          {prevPage}
          {pageList}
          {nextPage}
        </div>
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
