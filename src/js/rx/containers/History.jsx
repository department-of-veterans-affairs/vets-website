import React from 'react';
import { connect } from 'react-redux';

import { Table } from 'reactable';

import Pagination from '../components/Pagination';

class History extends React.Component {
  render() {
    const items = this.props.prescriptions.items;

    // TODO: replace reactable
    return (
      <div className="va-tab-content">
        <Table
            className="usa-table-borderless rx-table"
            data={items}
            itemsPerPage={10}
            pageButtonLimit={20}/>
        <Pagination/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(History);
