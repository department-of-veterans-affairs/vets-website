import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

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
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config';

class Active extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.state = {
      view: 'card',
    };
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.props.loadPrescriptions({ active: true });
    }
  }

  handleSort(sortKey, order) {
    const sortParam = order === 'DESC' ? `-${sortKey}` : sortKey;
    this.context.router.push({
      ...this.props.location,
      query: { sort: sortParam }
    });
    this.props.sortPrescriptions(sortKey, order);
  }

  renderViewSwitch() {
    const toggles = [
      { key: 'card', value: 'Card' },
      { key: 'list', value: 'List' },
    ];

    return (
      <div className="rx-view-toggle">View:&nbsp;
        <ul>
          {toggles.map(t => {
            const classes = classnames({
              active: this.state.view === t.key,
            });
            return (
              <li key={t.key} className={classes} onClick={() => this.setState({ view: t.key })}>{t.value}</li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator message="is loading your prescriptions..."/>;
    } else if (this.props.prescriptions) {
      const sortValue = this.props.sort;
      const currentSort = this.props.sort;

      if (this.state.view === 'list') {
        content = (
          <PrescriptionTable
              handleSort={this.handleSort}
              sortValue={sortValue.value}
              currentSort={currentSort}
              items={this.props.prescriptions}
              refillModalHandler={this.props.openRefillModal}
              glossaryModalHandler={this.props.openGlossaryModal}/>
        );
      } else {
        content = (
          <div>
            <p className="rx-tab-explainer">Your active VA prescriptions.</p>
            <SortMenu
                onChange={this.handleSort}
                onClick={this.handleSort}
                options={sortOptions}
                selected={sortValue.value}/>
            <PrescriptionList
                items={this.props.prescriptions}
                // If we're sorting by facility, tell PrescriptionList to group 'em.
                grouped={sortValue === 'facilityName'}
                refillModalHandler={this.props.openRefillModal}
                glossaryModalHandler={this.props.openGlossaryModal}/>
          </div>
        );
      }
    } else {
      content = (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn't retrieve your prescriptions.
          Please refresh this page or try again later.
          If this problem persists, please call the Vets.gov Help Desk
          at 1-855-574-7286, Monday ‒ Friday, 8:00 a.m. ‒ 8:00 p.m. (ET).
        </p>
      );
    }

    return (
      <div id="rx-active" className="va-tab-content">
        {this.renderViewSwitch()}
        {content}
      </div>
    );
  }
}

Active.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    ...state.prescriptions.active,
    prescriptions: state.prescriptions.items,
  };
};

const mapDispatchToProps = {
  openGlossaryModal,
  openRefillModal,
  loadPrescriptions,
  sortPrescriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(Active);
