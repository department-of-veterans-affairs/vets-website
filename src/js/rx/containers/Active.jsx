import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import PrescriptionList from '../components/PrescriptionList';
import PrintList from '../components/PrintList';
import SortMenu from '../components/SortMenu';

import { loadData } from '../actions/prescriptions.js';

function sortByName(obj) {
 /*
  Making all values the same case, to prevent
  alphabetization from getting wonky.
  */
  return obj.attributes['prescription-name'].toLowerCase();
}

function sortByFacilityName(obj) {
  return obj.attributes['facility-name'];
}

function sortByLastRequested(obj) {
  return obj.attributes['ordered-date'];
}

function groupByFacilityName(cards) {
  // Get every facility in the list of prescriptions
  let facilities = [];

  _.map(cards, (obj) => {
    facilities.push(obj.attributes['facility-name']);
  });

  // Eliminate repeated values.
  facilities = _.uniq(facilities);

  /*
  For every facility in the list, filter those prescriptions that
  match that facility name. Returns an object where each facility
  name is a key, and each value is an array of prescription objects
  for that facility.
  */
  const groups = {};
  _.map(facilities, (value) => {
    groups[value] = _.filter(cards, (obj) => {
      return obj.attributes['facility-name'] === value;
    });
  });

  return groups;
}

class Active extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadData());
    this.handleSortOnChange = this.handleSortOnChange.bind(this);
    this.handleSortOnClick = this.handleSortOnClick.bind(this);
    this.dispatchSortAction = this.dispatchSortAction.bind(this);
  }

  dispatchSortAction(action) {
    this.props.dispatch({ type: action });
  }

  handleSortOnChange(domEvent) {
    if (domEvent.type === 'change') {
      browserHistory.push({
        pathname: '/rx',
        query: {
          sort: domEvent.target.value
        }
      });
    }
    this.dispatchSortAction(domEvent.target.value);
  }

  handleSortOnClick(domEvent) {
    const fullURL = domEvent.target.href;

    // Find the sort parameter, split the query string on the = and retrieve value
    const sortParam = fullURL.match(/sort=[_A-Z]{1,}/)[0].split('=')[1];

    this.dispatchSortAction(sortParam);
  }

  render() {
    const sortValue = this.props.location.query.sort;
    const items = this.props.prescriptions.items;

    // TODO: Move to a config file?
    const sortOptions = [
      { value: 'SORT_PRESCRIPTION_NAME',
        label: 'Prescription name' },
      { value: 'SORT_FACILITY_NAME',
        label: 'Facility name' },
      { value: 'SORT_LAST_REQUESTED',
        label: 'Last requested' }];

    return (
      <div className="va-tab-content">
        <SortMenu
            options={sortOptions}
            selected={sortValue}
            changeHandler={this.handleSortOnChange}
            clickHandler={this.handleSortOnClick}/>
        <PrintList
            type="active"/>
        <PrescriptionList
            items={items}
            // If we're sorting by facility, tell PrescriptionList to group 'em.
            grouped={sortValue === 'SORT_FACILITY_NAME'}/>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);

