import React from 'react';
import { Link } from 'react-router';

import SortableTable from '../../common/components/SortableTable';
import { formatDate } from '../utils/helpers';
import Prescription from './Prescription';

class RefillStatus extends Prescription {
  render() {
    return (
      <div>
        {this.showTracking()}
        {this.showRefillStatus()}
        {this.showMessageProvider()}
      </div>
    );
  }
}

class PrescriptionTable extends React.Component {
  render() {
    const { items } = this.props;

    if (!items) {
      return null;
    }

    const fields = [
      { label: 'Prescription Name', value: 'prescriptionName' },
      { label: 'Last Requested Date', value: 'lastSubmitDate' },
      { label: 'Facility Name', value: 'facilityName' },
      { label: 'Refills Left', value: 'refillsLeft', nonSortable: true },
      { label: 'Refill Status', value: 'refillStatus', nonSortable: true },
    ];

    const data = items.map(item => {
      const attrs = item.attributes;

      return {
        id: item.id,
        prescriptionName: (
          <div>
            <Link to={`/${attrs.prescriptionId}`}>
              {attrs.prescriptionName}
            </Link><br/>
            <span>Prescription #: {item.id}</span>
          </div>
        ),
        lastSubmitDate: formatDate(attrs.refillSubmitDate),
        facilityName: attrs.facilityName,
        refillsLeft: attrs.refillRemaining,
        refillStatus: <RefillStatus {...item} glossaryModalHandler={this.props.glossaryModalHandler} refillModalHandler={this.props.refillModalHandler}/>,
      };
    });

    return (
      <SortableTable
          className="usa-table-borderless va-table-list rx-table rx-table-list"
          currentSort={this.props.currentSort}
          data={data}
          fields={fields}
          onSort={this.props.handleSort}/>
    );
  }
}

PrescriptionTable.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  glossaryModalHandler: React.PropTypes.func.isRequired,
  refillModalHandler: React.PropTypes.func.isRequired,
  handleSort: React.PropTypes.func.isRequired,
  currentSort: React.PropTypes.object.isRequired,
};

export default PrescriptionTable;
