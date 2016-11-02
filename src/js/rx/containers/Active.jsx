import React from 'react';
import { connect } from 'react-redux';

import {
  loadPrescriptions,
  sortPrescriptions
} from '../actions/prescriptions';
import { openRefillModal } from '../actions/modal';


import PrescriptionList from '../components/PrescriptionList';
import SortMenu from '../components/SortMenu';
import { sortOptions } from '../config';

class Active extends React.Component {
  constructor(props) {
    super(props);
    this.handleSortOnChange = this.handleSortOnChange.bind(this);
    this.handleSortOnClick = this.handleSortOnClick.bind(this);
  }

  componentDidMount() {
    this.props.loadPrescriptions({ active: true });
  }

  handleSortOnChange(domEvent) {
    if (domEvent.type === 'change') {
      this.context.router.push({
        pathname: '/',
        query: { sort: domEvent.target.value }
      });
    }
    this.props.sortPrescriptions(domEvent.target.value);
  }

  handleSortOnClick(domEvent) {
    const fullURL = domEvent.target.href;

    // Find the sort parameter, split the query string on the = and retrieve value
    const sortParam = fullURL.match(/sort=[-a-z]{1,}/i)[0].split('=')[1];
    this.props.sortPrescriptions(sortParam);
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    const sortParam = this.props.location.query.sort;

    if (items) {
      const sortValue = sortParam || 'lastRequested';

      content = (
        <div>
          <SortMenu
              changeHandler={this.handleSortOnChange}
              clickHandler={this.handleSortOnClick}
              options={sortOptions}
              selected={sortValue}/>
          <PrescriptionList
              items={this.props.prescriptions.items}
              // If we're sorting by facility, tell PrescriptionList to group 'em.
              grouped={sortValue === 'facilityName'}
              modalHandler={this.props.openRefillModal}/>
        </div>
      );
    }

    return (
      <div className="va-tab-content">
        <p className="rx-tab-explainer">Your active VA prescriptions.</p>
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
    alert: state.alert,
    disclaimer: state.disclaimer,
    modal: state.modal,
    prescriptions: state.prescriptions
  };
};

const mapDispatchToProps = {
  openRefillModal,
  loadPrescriptions,
  sortPrescriptions
};


export default connect(mapStateToProps, mapDispatchToProps)(Active);
