import React from 'react';
import classNames from 'classnames';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  next() {
    let nextPage;
    if (this.props.pages > this.props.page) {
      nextPage = (
        <a className="va-pagination-next" onClick={() => {this.props.onPageSelect(this.props.page + 1);}}>
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
        <a className="va-pagination-prev" onClick={() => {this.props.onPageSelect(this.props.page - 1);}}>
          Previous
        </a>
      );
    }
    return prevPage;
  }


  render() {
    if (this.props.pages === 1) {
      return <div/>;
    }

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

    return (
      <div className="va-pagination">
        <div className="va-pagination-inner">
          {this.prev()}
          {pageList}
          {this.next()}
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
