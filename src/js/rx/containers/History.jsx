import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import SortableTable from '../../common/components/SortableTable';
import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modal.js';
import Pagination from '../../common/components/Pagination';
import SortMenu from '../components/SortMenu';
import { glossary, rxStatuses } from '../config.js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentDidMount() {
    const query = _.pick(this.props.location.query, ['page', 'sort']);
    this.props.loadPrescriptions(query);
  }

  componentDidUpdate() {
    const oldPage = this.props.page;
    const oldSort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order
    );

    const query = _.pick(this.props.location.query, ['page', 'sort']);
    const newPage = +query.page || oldPage;
    const newSort = query.sort || oldSort;

    if (newPage !== oldPage || newSort !== oldSort) {
      this.props.loadPrescriptions(query);
    }
  }

  formattedSortParam(value, order) {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC'
               ? `-${formattedValue}`
               : formattedValue;
    return sort;
  }

  handleSort(value, order) {
    const sort = this.formattedSortParam(value, order);
    this.context.router.push({
      pathname: '/history',
      query: { ...this.props.location.query, sort }
    });
  }

  handlePageSelect(page) {
    this.context.router.push({
      pathname: '/history',
      query: { ...this.props.location.query, page }
    });
  }

  openGlossaryModal(term) {
    const content = glossary.filter(obj => {
      return obj.term === term;
    });
    this.props.openGlossaryModal(content);
  }

  render() {
    const items = this.props.prescriptions;
    let content;

    if (items) {
      const currentSort = this.props.sort;

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
          id: item.id,

          orderedDate:
            attrs.orderedDate
            ? moment(attrs.orderedDate).format('MMM DD, YYYY')
            : 'Not available',

          dispensedDate:
            attrs.dispensedDate
            ? moment(attrs.dispensedDate).format('MMM DD, YYYY')
            : 'Not available',

          prescriptionName: (
            <Link to={`/${attrs.prescriptionId}`}>
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
              className="usa-table-borderless va-table-list rx-table rx-table-list"
              currentSort={currentSort}
              data={data}
              fields={fields}
              onSort={this.handleSort}/>
          <Pagination
              onPageSelect={this.handlePageSelect}
              page={this.props.page}
              pages={this.props.pages}/>
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

History.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    ...state.prescriptions.history,
    prescriptions: state.prescriptions.items
  };
};

const mapDispatchToProps = {
  loadPrescriptions,
  openGlossaryModal
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
