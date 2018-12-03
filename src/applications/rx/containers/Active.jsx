/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Scroll from 'react-scroll';
import _ from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation/Pagination';

import recordEvent from 'platform/monitoring/record-event';
import { getScrollOptions } from 'platform/utilities/ui';
import siteName from 'platform/brand-consolidation/site-name';
import CallVBACenter from 'platform/brand-consolidation/components/CallVBACenter';

import { openGlossaryModal, openRefillModal } from '../actions/modals';

import { loadPrescriptions, sortPrescriptions } from '../actions/prescriptions';

import PrescriptionList from '../components/PrescriptionList';
import PrescriptionTable from '../components/PrescriptionTable';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

class Active extends React.Component {
  constructor(props) {
    super(props);

    const viewPref = sessionStorage.getItem('rxView');

    this.handleSort = this.handleSort.bind(this);
    this.pushAnalyticsEvent = this.pushAnalyticsEvent.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);

    this.checkWindowSize = _.debounce(() => {
      const toggleDisplayStyle = window
        .getComputedStyle(this.viewToggle, null)
        .getPropertyValue('display');
      // the viewToggle element is hidden with CSS on the $small breakpoint
      // on small screens, the view toggle is hidden and list view disabled
      if (this.viewToggle && toggleDisplayStyle === 'none') {
        this.setState({ view: 'card' });
      } else if (viewPref) {
        this.setState({ view: viewPref });
      }
    }, 200);

    this.state = {
      view: viewPref || 'list',
    };
  }

  componentDidMount() {
    if (!this.props.loading) {
      const query = _.pick(this.props.location.query, ['page', 'sort']);
      this.props.loadPrescriptions({ ...query, active: true });
    }
    window.addEventListener('resize', this.checkWindowSize);
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
        this.props.loadPrescriptions({ ...query, active: true });
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  }

  scrollToTop() {
    scroller.scrollTo('active', getScrollOptions());
  }

  formattedSortParam(value, order) {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC' ? `-${formattedValue}` : formattedValue;
    return sort;
  }

  pushAnalyticsEvent() {
    recordEvent({
      event: 'rx-view-change',
      viewType: this.state.view,
    });
  }

  handleSort(sortKey, sortOrder) {
    const sort = this.formattedSortParam(sortKey, sortOrder);
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, sort },
    });
  }

  handlePageSelect(page) {
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page },
    });
  }

  renderViewSwitch() {
    if (!this.props.prescriptions) {
      return null;
    }

    const toggles = [
      { key: 'card', value: 'Card' },
      { key: 'list', value: 'List' },
    ];

    return (
      <div
        className="rx-view-toggle"
        ref={elem => {
          this.viewToggle = elem;
        }}
      >
        View:
        <ul>
          {toggles.map(t => {
            const classes = classnames({
              active: this.state.view === t.key,
            });

            const onClick = () => {
              this.setState({ view: t.key }, () => {
                this.pushAnalyticsEvent();
                sessionStorage.setItem('rxView', t.key);
              });
            };

            return (
              <li key={t.key} className={classes} onClick={onClick}>
                {t.value}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderContent = () => {
    if (this.props.loading) {
      return <LoadingIndicator message="Loading your prescriptions..." />;
    }

    const items = this.props.prescriptions;

    if (!items) {
      return (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn’t retrieve your prescriptions. Please refresh this page or
          try again later. If you keep having trouble, please{' '}
          <CallVBACenter>
            call the {siteName}
            Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday,
            8:00 a.m. &#8211; 8:00 p.m. (ET).
          </CallVBACenter>
        </p>
      );
    }

    if (!items.length) {
      const content = (
        <p>
          It looks like you don’t have any VA prescriptions to refill right now.
          If you think this is a mistake, please contact your VA health care
          team and ask them to check your prescription records. If you’re still
          having trouble, please{' '}
          <CallVBACenter>
            call the {siteName} Help Desk at{' '}
            <a href="tel:8555747286">1-855-574-7286</a> (TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>
            ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
          </CallVBACenter>
        </p>
      );

      return (
        <AlertBox
          isVisible
          status="warning"
          headline="No refills available"
          content={content}
        />
      );
    }

    const currentSort = this.props.sort;
    let prescriptionsView;

    if (this.state.view === 'list') {
      prescriptionsView = (
        <PrescriptionTable
          handleSort={this.handleSort}
          currentSort={currentSort}
          items={items}
          refillModalHandler={this.props.openRefillModal}
          glossaryModalHandler={this.props.openGlossaryModal}
        />
      );
    } else {
      prescriptionsView = (
        <PrescriptionList
          items={items}
          // If we’re sorting by facility, tell PrescriptionList to group them.
          grouped={currentSort.value === 'facilityName'}
          handleSort={this.handleSort}
          currentSort={currentSort}
          refillModalHandler={this.props.openRefillModal}
          glossaryModalHandler={this.props.openGlossaryModal}
        />
      );
    }

    return (
      <div>
        <p className="rx-tab-explainer">Your active VA prescriptions</p>
        {this.renderViewSwitch()}
        {prescriptionsView}
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
      <ScrollElement id="rx-active" name="active">
        {this.renderContent()}
      </ScrollElement>
    );
  }
}

Active.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const rxState = state.health.rx;
  return {
    ...rxState.prescriptions.active,
    prescriptions: rxState.prescriptions.items,
  };
};

const mapDispatchToProps = {
  openGlossaryModal,
  openRefillModal,
  loadPrescriptions,
  sortPrescriptions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Active);
