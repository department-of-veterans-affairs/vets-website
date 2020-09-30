import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import ResponsiveTable from '../../responsive-table/ResponsiveTable';
import { clientServerErrorContent } from '../helpers';
import { chunk } from 'lodash';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';

class Payments extends Component {
  state = {
    page: 1,
    maxRows: 5,
    numberOfPages: null,
    currentlyShowingData: [],
    paginatedData: null,
    fromNumber: null,
    toNumber: null,
  };

  componentDidMount() {
    this.handleLoadData();
  }

  // when the page loads, load the initial data set from props into the table
  handleLoadData() {
    // Creates an array of arrays of the data passed in as props
    // in this shape [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]]
    const chunkedData = chunk(this.props.data, this.state.maxRows);
    this.setState({
      currentlyShowingData: chunkedData[0],
      paginatedData: chunkedData,
      numberOfPages: chunkedData.length,
    });
    this.handleDisplayNumbers(1);
  }

  handleDataPagination = page => {
    this.setState({
      currentlyShowingData: this.state.paginatedData[page - 1],
      page,
    });
    this.handleDisplayNumbers(page);
  };

  handleDisplayNumbers = page => {
    let fromDisplayNumber = 1;
    let toDisplayNumber = 1;
    if (this.props.data.length > this.state.maxRows) {
      toDisplayNumber = this.state.maxRows;
      if (page > 1) {
        fromDisplayNumber = (page - 1) * this.state.maxRows + 1;
        if (this.props.data.length < page * this.state.maxRows) {
          toDisplayNumber = this.props.data.length;
        } else {
          toDisplayNumber = page * this.state.maxRows;
        }
      }
    } else {
      toDisplayNumber = this.props.data.length;
    }

    this.setState({ fromNumber: fromDisplayNumber, toNumber: toDisplayNumber });
  };

  render() {
    let tableContent = '';
    let tableAriaLabelldBy = 'paymentsRecievedHeader paymentsRecievedContent';
    if (this.props.tableVersion === 'returned') {
      tableAriaLabelldBy = 'paymentsReturnedHeader paymentsReturnedContent';
    }
    if (this.state.currentlyShowingData) {
      tableContent = (
        <>
          {this.props.textContent}
          <p className="vads-u-font-size--lg vads-u-font-family--serif">
            Displaying {this.state.fromNumber} - {this.state.toNumber} of{' '}
            {this.props.data.length}
          </p>
          <ResponsiveTable
            ariaLabelledBy={tableAriaLabelldBy}
            className="va-table"
            currentSort={{
              value: 'String',
              order: 'ASC',
            }}
            fields={this.props.fields}
            data={this.state.currentlyShowingData}
            maxRows={10}
          />
          <Pagination
            className="vads-u-border-top--0"
            onPageSelect={page => this.handleDataPagination(page)}
            page={this.state.page}
            pages={this.state.numberOfPages}
            maxPageListLength={this.state.numberOfPages}
            showLastPage
          />
        </>
      );
    } else {
      tableContent = (
        <AlertBox
          className={alertClasses}
          content={clientServerErrorContent('Received')}
          status="info"
          isVisible
        />
      );
    }
    return <>{tableContent}</>;
  }
}

export default Payments;
