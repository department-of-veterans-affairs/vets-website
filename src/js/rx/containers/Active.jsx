import React from 'react';
import { connect } from 'react-redux';

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
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config';

class Active extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.props.loadPrescriptions({ active: true });
    }
  }

  componentDidUpdate() {
    const newSort = this.props.location.query.sort;
    const oldSort = this.props.sort;

    if (newSort !== oldSort) {
      this.props.sortPrescriptions(newSort);
    }
  }

  handleSort(sort) {
    this.context.router.push({
      ...this.props.location,
      query: { sort }
    });
  }

  render() {
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator message="is loading your prescriptions..."/>;
    } else if (this.props.prescriptions) {
      const sortValue = this.props.sort;

      content = (
        <div>
          <p className="rx-tab-explainer">Your active VA prescriptions.</p>
          <SortMenu
              onChange={this.handleSort}
              onClick={this.handleSort}
              options={sortOptions}
              selected={sortValue}/>
          <PrescriptionList
              items={this.props.prescriptions}
              // If we're sorting by facility, tell PrescriptionList to group 'em.
              grouped={sortValue === 'facilityName'}
              refillModalHandler={this.props.openRefillModal}
              glossaryModalHandler={this.props.openGlossaryModal}/>
        </div>
      );
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
