/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';

import {
  loadPrescriptions,
  sortPrescriptions
} from '../actions/prescriptions';

import {
  openGlossaryModal,
  openRefillModal
} from '../actions/modals';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import PrescriptionList from '../components/PrescriptionList';
import PrescriptionTable from '../components/PrescriptionTable';

class Active extends React.Component {
  constructor(props) {
    super(props);

    const viewPref = sessionStorage.getItem('rxView');

    this.handleSort = this.handleSort.bind(this);
    this.pushAnalyticsEvent = this.pushAnalyticsEvent.bind(this);

    this.checkWindowSize = _.debounce(() => {
      const toggleDisplayStyle = window.getComputedStyle(this.viewToggle, null).getPropertyValue('display');
      // the viewToggle element is hidden with CSS on the $small breakpoint
      // on small screens, the view toggle is hidden and list view disabled
      if (this.viewToggle && (toggleDisplayStyle === 'none')) {
        this.setState({ view: 'card', });
      } else if (viewPref) {
        this.setState({ view: viewPref, });
      }
    }, 200);

    this.state = {
      view: viewPref || 'list',
    };
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.props.loadPrescriptions({ active: true });
    }
    window.addEventListener('resize', this.checkWindowSize);
  }

  componentDidUpdate() {
    const { prescriptions, sort: currentSort } = this.props;
    const requestedSort = this.props.location.query.sort || 'prescriptionName';
    const sortOrder = requestedSort[0] === '-' ? 'DESC' : 'ASC';
    const sortValue = sortOrder === 'DESC'
      ? requestedSort.slice(1)
      : requestedSort;

    const shouldSort =
      !_.isEmpty(prescriptions) &&
      (currentSort.value !== sortValue ||
      currentSort.order !== sortOrder);

    if (shouldSort) {
      this.props.sortPrescriptions(sortValue, sortOrder);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  }

  pushAnalyticsEvent() {
    window.dataLayer.push({
      event: 'rx-view-change',
      viewType: this.state.view
    });
  }

  handleSort(sortKey, sortOrder) {
    const sort = sortOrder === 'DESC' ? `-${sortKey}` : sortKey;
    this.context.router.push({
      ...this.props.location,
      query: { sort }
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
        ref={(elem) => { this.viewToggle = elem; }}>
        View:
        <ul>
          {toggles.map(t => {
            const classes = classnames({
              active: this.state.view === t.key,
            });

            const onClick = () => {
              this.setState(
                { view: t.key },
                () => {
                  this.pushAnalyticsEvent();
                  sessionStorage.setItem('rxView', t.key);
                }
              );
            };

            return (
              <li key={t.key} className={classes} onClick={onClick}>{t.value}</li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator message="Loading your prescriptions..."/>;
    } else if (this.props.prescriptions) {
      const currentSort = this.props.sort;
      let prescriptionsView;

      if (this.state.view === 'list') {
        prescriptionsView = (
          <PrescriptionTable
            handleSort={this.handleSort}
            currentSort={currentSort}
            items={this.props.prescriptions}
            refillModalHandler={this.props.openRefillModal}
            glossaryModalHandler={this.props.openGlossaryModal}/>
        );
      } else {
        prescriptionsView = (
          <PrescriptionList
            items={this.props.prescriptions}
            // If we’re sorting by facility, tell PrescriptionList to group 'em.
            grouped={currentSort.value === 'facilityName'}
            handleSort={this.handleSort}
            currentSort={currentSort}
            refillModalHandler={this.props.openRefillModal}
            glossaryModalHandler={this.props.openGlossaryModal}/>
        );
      }

      content = (
        <div>
          <p className="rx-tab-explainer">Your active VA prescriptions</p>
          {this.renderViewSwitch()}
          {prescriptionsView}
        </div>
      );
    } else {
      content = (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn’t retrieve your prescriptions.
          Please refresh this page or try again later. If this problem persists, please call the Vets.gov Help Desk
          at 1-855-574-7286, Monday ‒ Friday, 8:00 a.m. ‒ 8:00 p.m. (ET).
        </p>
      );
    }

    return (
      <div id="rx-active" className="va-tab-content">
        {content}
      </div>
    );
  }
}

Active.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
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
  sortPrescriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(Active);
