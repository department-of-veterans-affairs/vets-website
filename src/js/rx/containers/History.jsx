import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import { loadPrescriptions } from '../actions/prescriptions';
import PrintList from '../components/PrintList';
import Pagination from '../components/Pagination';
import SortableTable from '../components/tables/SortableTable';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadPrescriptions());
  }

  handleSort(param, order) {
    const formattedParam = _.snakeCase(param);
    const sortValue = order === 'DESC'
                    ? `-${formattedParam}`
                    : formattedParam;
    this.props.dispatch(loadPrescriptions({
      sort: sortValue
    }));
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    if (items) {
      const currentSort = this.props.prescriptions.history.sort;

      const fields = [
        { label: 'Last requested', value: 'ordered-date' },
        { label: 'Prescription', value: 'prescription-name' },
        { label: 'Prescription status', value: 'refill-status' }
      ];

      const data = items.map(item => {
        const attrs = item.attributes;
        return {
          'ordered-date': moment(
              attrs['ordered-date']
            ).format('MMM DD, YYYY'),
          'prescription-name': attrs['prescription-name'],
          'refill-status': _.capitalize(attrs['refill-status'])
        };
      });

      content = (
        <div>
          <PrintList
              type="history"/>
          <SortableTable
              className="usa-table-borderless rx-table"
              currentSort={currentSort}
              data={data}
              fields={fields}
              onSort={this.handleSort}/>
          <Pagination/>
        </div>
      );
    }

    return (
      <div className="va-tab-content">
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(History);
