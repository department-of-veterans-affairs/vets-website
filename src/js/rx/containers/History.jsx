import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import SortableTable from '../../common/components/SortableTable';
import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modals';
import Pagination from '../../common/components/Pagination';
import SortMenu from '../components/SortMenu';
import { rxStatuses } from '../config';
import { formatDate, getModalTerm } from '../utils/helpers';

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
      ...this.props.location,
      query: { ...this.props.location.query, sort }
    });
  }

  handlePageSelect(page) {
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page }
    });
  }

  openGlossaryModal(term) {
    const content = getModalTerm(term);
    this.props.openGlossaryModal(content);
  }

  render() {
    const items = this.props.prescriptions;
    let content;

    if (items) {
      const currentSort = this.props.sort;

      const fields = [
        { label: 'Last submit date', value: 'refillSubmitDate' },
        { label: 'Last fill date', value: 'refillDate' },
        { label: 'Prescription', value: 'prescriptionName' },
        { label: 'Prescription status', value: 'refillStatus' }
      ];

      const data = items.map(item => {
        const attrs = item.attributes;
        const status = rxStatuses[attrs.refillStatus];

        return {
          id: item.id,

          refillSubmitDate: formatDate(attrs.refillSubmitDate),

          refillDate: formatDate(attrs.refillDate, { validateInPast: true }),

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
              onChange={this.handleSort}
              options={fields}
              selected={currentSort.value}/>
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
        <p className="rx-tab-explainer">Your VA prescription refill history.</p>
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
