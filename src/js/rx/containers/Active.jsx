import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import PrescriptionList from '../components/PrescriptionList';
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
  }
  render() {
    const sortValue = this.props.location.query.sort;
    const items = this.props.prescriptions.items;
    let sorted = null;

    switch (sortValue) {
      case 'prescription-name':
        sorted = _.sortBy(items, sortByName);
        break;
      case 'refill-submit-date':
        sorted = _.sortBy(items, sortByLastRequested);
        break;
      case 'facility-name':
        sorted = groupByFacilityName(_.sortBy(items, sortByFacilityName));
        break;
      default:
        sorted = items;
    }

    return (
      <PrescriptionList
          items={sorted}/>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Active);
