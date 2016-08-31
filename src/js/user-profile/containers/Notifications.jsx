import React from 'react';
import faker from 'faker';
import moment from 'moment';
import { Table } from 'reactable';

// Generate fake data.  TODO: Retrieve this from the actual API
function createFakeData() {
  return {
    'Job Date': moment(faker.date.past()).format('ll'),
    Job: faker.commerce.productName(),
    Progress: faker.random.number()
  };
}

const data = Array.from({ length: 10 }, createFakeData);


class Notifications extends React.Component {
  render() {
    return (
      <div className="va-tab-content">
        <Table
            className="usa-table-borderless rx-table"
            data={data}
            itemsPerPage={10}
            pageButtonLimit={20}/>
      </div>
    );
  }
}

export default Notifications;
