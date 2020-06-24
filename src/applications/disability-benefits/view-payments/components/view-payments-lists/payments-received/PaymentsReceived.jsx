import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ResponsiveTable from '../../responsive-table/ResponsiveTable';
import { clientServerErrorContent } from '../helpers';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';

class PaymentsReceived extends Component {

  state = {
    page: 1,
    maxRows: 5,
    paginationStartIndex: 0,
    paginationEndIndex: 5,
    numberOfPages: null,
    allTableData: mockData,
    currentlyShowingData: [],
  };

  componentDidMount() {
    this.handleLoadData();
    this.handleNumberOfPages();
  }

  // when the page loads, load the initial data set into the table
  handleLoadData() {
    const dataCopy = [...this.state.allTableData];
    const initialDataSet = dataCopy.slice(
      this.state.paginationStartIndex,
      this.state.paginationEndIndex,
    );
    this.setState({ currentlyShowingData: initialDataSet });
  }

  /*
    We need to figure out how many pages to display on the Pagination
    we can do this by taking the number of rows in all the table data
    and dividing it by what the maxRows is and rounding up to the nearest
    wole number
  */
  handleNumberOfPages = () => {
    let howManyPages = this.state.allTableData.length / this.state.maxRows;
    howManyPages = Math.ceil(howManyPages);
    this.setState({ numberOfPages: howManyPages });
  };

  paginate = (array, pageSize, pageNumber) =>
    array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  handleDataPagination = page => {
    // console.log(`The page passed in is ${page}`);
    // incriment or decriment pagination indexes by number of maxRows
    const paginatedData = this.paginate(
      this.state.allTableData,
      this.state.maxRows,
      page,
    );
    this.setState({ currentlyShowingData: paginatedData, page });
  };

  render() {
  let tableContent = '';
  if (props.data) {
    tableContent = (
      <ResponsiveTable
        className="va-table"
        currentSort={{
          value: 'String',
          order: 'ASC',
        }}
        fields={props.fields}
        data={props.data}
        maxRows={10}
      />
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
