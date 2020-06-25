import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination' 
import ResponsiveTable from '../../responsive-table/ResponsiveTable';
import { clientServerErrorContent } from '../helpers';
import { chunk } from 'lodash';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';

class PaymentsReceived extends Component {

  state = {
    page: 1,
    maxRows: 5,
    paginationStartIndex: 0,
    paginationEndIndex: 5,
    numberOfPages: null,
    allTableData: null,
    currentlyShowingData: [],
    paginatedData: null,
    fromDisplay: null,
    toDisplay: null,
  };

  componentDidMount() {
    this.handleLoadData();
  }

  // when the page loads, load the initial data set from props into the table
  handleLoadData() {
    // Creates an array of arrays of the data passed in as props
    // in this shape [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]]
    let chunkedData = chunk(this.props.data, this.state.maxRows);
    this.setState({currentlyShowingData: chunkedData[0], paginatedData: chunkedData, numberOfPages: chunkedData.length });
  }

  handleDataPagination = page => {
    this.setState({currentlyShowingData: this.state.paginatedData[page - 1], page})
  };

  render() {
  let tableContent = '';
  if (this.state.currentlyShowingData) {
    console.log(this.state.currentlyShowingData);
    tableContent = (
      <>
      <ResponsiveTable
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
  return (
    <>
      <h3 className="vads-u-font-size--xl">Payments you received</h3>
      <p>
        VA pays benefits on the first day of the month for the previous month.
        If the first day of the month is a weekend or holiday, VA pays benefits
        on the last business day before the 1st. For example, if May 1st is a
        Saturday, benefits would be paid on Friday, April 30.
      </p>
      {tableContent}
    </>
  );
  };
};

export default PaymentsReceived;
