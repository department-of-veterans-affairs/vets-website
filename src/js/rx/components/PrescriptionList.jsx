import React from 'react';

import Prescription from '../components/Prescription';
import PrescriptionGroup from '../components/PrescriptionGroup';

import _ from 'lodash';

function makeItem(props, i) {
  return (
    <Prescription { ...props } key={i}/>
  );
}

class PrescriptionList extends React.Component {
  render() {
    const items = this.props.items;
    let prescriptions;
    let facilities;

    // If we need to display the list as a grouping...
    if (this.props.grouped) {
      // Extract facilities from items as an array.
      // Make it an array of unique values.
      facilities = _.uniq(_.map(items, (obj) => {
        return obj.attributes['facility-name'];
      }));

      /*
      For every facility in `facilities`, filter those
      prescriptions that match that facility name.

      Returns an object in the form:
      { facilityname: [array,of,prescription,objects] }
      */
      const groupByFacility = {};

      _.map(facilities, (value) => {
        groupByFacility[value] = _.filter(items, (obj) => {
          return obj.attributes['facility-name'] === value;
        });
      });

      // Create prescription groups containing prescriptions
      prescriptions = facilities.map((value, index) => {
        const groupChildren = groupByFacility[value].map(makeItem);

        return (<PrescriptionGroup
            title={value}
            key={index}
            items={groupChildren}/>);
      });
    } else {
      prescriptions = items.map(makeItem);
    }

    const items = this.props.items;

    let prescriptions;

    // If this an array, just build a list of prescriptions.
    if (_.isArray(items)) {
      prescriptions = items.map(makeItem);
    }

    // If this is an object (as passed in from Active), build
    // a group.
    if (_.isPlainObject(items)) {
      const groups = _.keys(this.props.items);

      prescriptions = groups.map((value, index) => {
        const groupChildren = items[value].map(makeItem);
        return (<PrescriptionGroup
            title={value}
            key={index}
            items={groupChildren}/>);
      });
    }

    return (
      <div className="rx-prescription-items cf">
        {prescriptions}
      </div>
    );
  }
}

export default PrescriptionList;
