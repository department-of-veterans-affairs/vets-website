import React from 'react';
import faker from 'faker';
import moment from 'moment';
import { Table } from 'reactable';

import PrintList from '../components/PrintList';
import Pagination from '../components/Pagination';

// Generate fake data.  TODO: Retrieve this from the actual API
function createFakeData() {
  return {
    'Date prescribed': moment(faker.date.past()).format('ll'),
    Medicine: faker.commerce.productName(),
    'Last filled': moment(faker.date.past()).format('ll'),
    Dosage: faker.random.number(),
    Prescriber: `Dr. ${faker.name.findName()}`,
    Status: 'Active'
  };
}

const data = Array.from({ length: 400 }, createFakeData);


class History extends React.Component {
  render() {
    return (
      <div className="va-tab-content">
        <PrintList
            type="history"/>
        <Table
            className="usa-table-borderless rx-table"
            data={data}
            itemsPerPage={10}
            pageButtonLimit={20}/>
        <Pagination/>
      </div>
    );
  }
}

export default History;
