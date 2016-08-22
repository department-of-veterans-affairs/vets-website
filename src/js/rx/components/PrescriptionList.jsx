import React from 'react';

import Prescription from '../components/Prescription';
import PrescriptionGroup from '../components/PrescriptionGroup';
import PrintList from '../components/PrintList';
import SortMenu from '../components/SortMenu';
import _ from 'lodash';

function makeItem(props, i) {
  return (
    <Prescription { ...props } key={i}/>
  );
}

class PrescriptionList extends React.Component {
  render() {
    // Options for the SortMenu below.
    const sortOptions = [
      { value: 'prescription-name',
        label: 'Prescription name' },
      { value: 'facility-name',
        label: 'Facility name' },
      { value: 'refill-submit-date',
        label: 'Last requested' }];

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
      <div className="va-tab-content">
        <SortMenu options={sortOptions}/>
        <PrintList
            type="active"/>
        <div className="rx-prescription-items cf">
          {prescriptions}
        </div>
      </div>
    );
  }
}

export default PrescriptionList;
