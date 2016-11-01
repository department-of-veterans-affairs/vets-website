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
        return obj.attributes.facilityName;
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
          return obj.attributes.facilityName === value;
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

    return (
      <div className="rx-prescription-items cf">
        {prescriptions}
      </div>
    );
  }
}

PrescriptionList.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  grouped: React.PropTypes.bool
};

export default PrescriptionList;
