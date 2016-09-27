import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modal.js';
import Pagination from '../components/Pagination';
import SortableTable from '../components/tables/SortableTable';
import SortMenu from '../components/SortMenu';
import { glossary, rxStatuses } from '../config.js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  loadData(options) {
    let combinedOptions;
    if (options) {
      combinedOptions = {
        sort: options.sort || this.props.prescriptions.history.sort,
        page: options.page || this.props.prescriptions.history.page
      };
    }
    this.props.dispatch(loadPrescriptions(combinedOptions));
  }

  handleSort(value, order) {
    const sort = { value, order };
    this.loadData({ sort });
  }

  handlePageSelect(page) {
    this.loadData({ page });
  }

  openGlossaryModal(term) {
    const content = glossary.filter(obj => {
      return obj.term === term;
    });
    this.props.dispatch(openGlossaryModal(content));
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    if (items) {
      const currentSort = this.props.prescriptions.history.sort;

      const fields = [
        { label: 'Last requested', value: 'orderedDate' },
        { label: 'Last fill date', value: 'dispensedDate' },
        { label: 'Prescription', value: 'prescriptionName' },
        { label: 'Prescription status', value: 'refillStatus' }
      ];

      const data = items.map(item => {
        const attrs = item.attributes;
        const status = rxStatuses[attrs.refillStatus];

        return {
          orderedDate: moment(
              attrs.orderedDate
            ).format('MMM DD, YYYY'),

          dispensedDate: moment(
              attrs.dispensedDate
            ).format('MMM DD, YYYY'),

          prescriptionName: (
            <Link to={`/rx/prescription/${attrs.prescriptionId}`}>
              {attrs.prescriptionName}
            </Link>
            ),

          refillStatus: (
            <a onClick={() => this.openGlossaryModal(status)}>
              {status}
            </a>
            )
        };
      });

      content = (
        <div>
          <SortMenu
              changeHandler={(e) => this.handleSort(e.target.value)}
              options={fields}
              selected={currentSort}/>
          <SortableTable
              className="usa-table-borderless rx-table rx-table-list"
              currentSort={currentSort}
              data={data}
              fields={fields}
              onSort={this.handleSort}/>
          <Pagination
              onPageSelect={this.handlePageSelect}
              page={this.props.prescriptions.history.page}
              pages={this.props.prescriptions.history.pages}/>
        </div>
      );
    }

    return (
      <div id="rx-history" className="va-tab-content">
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(History);
