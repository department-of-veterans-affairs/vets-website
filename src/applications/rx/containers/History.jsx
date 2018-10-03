import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';
import SortableTable from '@department-of-veterans-affairs/formation/SortableTable';

import { getScrollOptions } from '../../../platform/utilities/ui';
import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modals';
import GlossaryLink from '../components/GlossaryLink';
import SortMenu from '../components/SortMenu';
import { rxStatuses } from '../config';
import { formatDate } from '../utils/helpers';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

class History extends React.Component {
  componentDidMount() {
    if (!this.props.loading) {
      const query = _.pick(this.props.location.query, ['page', 'sort']);
      this.props.loadPrescriptions(query);
    }
  }

  componentDidUpdate(prevProps) {
    const currentPage = this.props.page;
    const currentSort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order,
    );

    const query = _.pick(this.props.location.query, ['page', 'sort']);
    const requestedPage = +query.page || currentPage;
    const requestedSort = query.sort || currentSort;

    // Check if query params requested are different from state.
    const pageChanged = requestedPage !== currentPage;
    const sortChanged = requestedSort !== currentSort;

    if (pageChanged || sortChanged) {
      this.scrollToTop();
    }

    if (!this.props.loading) {
      if (pageChanged || sortChanged) {
        this.props.loadPrescriptions(query);
      }

      // Check if query params changed in state.
      const prevSort = this.formattedSortParam(
        prevProps.sort.value,
        prevProps.sort.order,
      );
      const pageUpdated = prevProps.page !== currentPage;
      const sortUpdated = prevSort !== currentSort;

      if (pageUpdated || sortUpdated) {
        this.scrollToTop();
      }
    }
  }

  scrollToTop = () => {
    scroller.scrollTo('history', getScrollOptions());
  };

  formattedSortParam = (value, order) => {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC' ? `-${formattedValue}` : formattedValue;
    return sort;
  };

  handleSort = (value, order) => {
    const sort = this.formattedSortParam(value, order);
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, sort },
    });
  };

  handlePageSelect = page => {
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  };

  renderContent = () => {
    if (this.props.loading) {
      return <LoadingIndicator message="Loading your prescriptions..." />;
    }

    const items = this.props.prescriptions;

    if (!items) {
      return (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn’t retrieve your prescriptions. Please refresh this page or
          try again later. If this problem persists, please call the Vets.gov
          Help Desk at <a href="tel:8555747286">1-855-574-7286</a>, TTY:{' '}
          <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday,
          8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      );
    }

    if (!items.length) {
      const content = (
        <p>
          It looks like you don’t have any active VA prescriptions. If you’re
          taking a medicine that you don’t see listed here—or if you have any
          questions about your current medicines—please contact your VA health
          care team. If you need more help, please call the Vets.gov Help Desk
          at <a href="tel:8555747286">1-855-574-7286</a> (TTY:{' '}
          <a href="tel:18008778339">1-800-877-8339</a>
          ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET). We’re here
          Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
        </p>
      );

      return (
        <AlertBox
          isVisible
          status="warning"
          headline="No prescription history/no active VA prescriptions
"
          content={content}
        />
      );
    }

    const currentSort = this.props.sort;

    const fields = [
      { label: 'Last submit date', value: 'refillSubmitDate' },
      { label: 'Last fill date', value: 'refillDate' },
      { label: 'Prescription', value: 'prescriptionName' },
      {
        label: 'Prescription status',
        value: 'refillStatus',
        nonSortable: true,
      },
    ];

    const data = items.map(item => {
      const attrs = item.attributes;
      const status = rxStatuses[attrs.refillStatus];

      return {
        id: item.id,

        refillSubmitDate: formatDate(attrs.refillSubmitDate),

        refillDate: formatDate(attrs.refillDate, { validateInPast: true }),

        prescriptionName: (
          <Link to={`/${attrs.prescriptionId}`}>{attrs.prescriptionName}</Link>
        ),

        refillStatus: (
          <GlossaryLink term={status} onClick={this.props.openGlossaryModal} />
        ),
      };
    });

    return (
      <div>
        <p className="rx-tab-explainer">Your VA prescription refill history</p>
        <div className="show-for-small-only">
          <SortMenu
            onClick={this.handleSort}
            onChange={this.handleSort}
            options={fields}
            selected={currentSort}
          />
        </div>
        <SortableTable
          className="va-table-list rx-table rx-table-list"
          currentSort={currentSort}
          data={data}
          fields={fields}
          onSort={this.handleSort}
        />
        <Pagination
          onPageSelect={this.handlePageSelect}
          page={this.props.page}
          pages={this.props.pages}
        />
      </div>
    );
  };

  render() {
    return (
      <ScrollElement id="rx-history" name="history" className="va-tab-content">
        {this.renderContent()}
      </ScrollElement>
    );
  }
}

History.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const rxState = state.health.rx;
  return {
    ...rxState.prescriptions.history,
    prescriptions: rxState.prescriptions.items,
  };
};

const mapDispatchToProps = {
  loadPrescriptions,
  openGlossaryModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(History);
