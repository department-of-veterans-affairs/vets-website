import React from 'react';

import Prescription from '../components/Prescription';
import PrintList from '../components/PrintList';
import SortMenu from '../components/SortMenu';

function makeItem(props, i) {
  return (
    <Prescription { ...props } key={i}/>
  );
}

class PrescriptionList extends React.Component {
  render() {
    const items = this.props.items.map(makeItem);

    const sortOptions = [
      { value: 'prescription-name',
        label: 'Prescription name' },
      { value: 'facility-name',
        label: 'Facility name' },
      { value: 'refill-submit-date',
        label: 'Last requested' }];

    return (
      <div className="va-tab-content">
        <SortMenu options={sortOptions}/>
        <PrintList
            type="active"/>
        <div className="rx-prescription-items cf">
          {items}
        </div>
      </div>
    );
  }
}

export default PrescriptionList;
