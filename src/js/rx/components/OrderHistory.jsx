import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import SortableTable from '../../common/components/SortableTable';
import { formatDate } from '../utils/helpers';
import TrackPackageLink from './TrackPackageLink';

class OrderHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSort: {
        value: 'fillDate',
        order: 'DESC'
      }
    };
  }

  render() {
    const data = this.props.items.map(item => {
      const {
        id,
        attributes: {
          deliveryService,
          otherPrescriptions,
          prescriptionName,
          prescriptionNumber,
          shippedDate,
          trackingNumber
        },
        links: { trackingUrl }
      } = item;

      const prescriptions = [
        <div key={prescriptionNumber}>{prescriptionName}</div>,
        ...otherPrescriptions.map(p =>
          <div key={p.prescriptionNumber}>{p.prescriptionName}</div>
        )
      ];

      return {
        id,
        fillDate: formatDate(shippedDate),
        carrier: deliveryService.toUpperCase(),
        trackingLink: (<TrackPackageLink
            className="rx-history-tracking"
            external
            text={trackingNumber}
            url={trackingUrl}/>),
        prescriptions
      };
    });

    const fields = [
      { label: 'Fill date', value: 'fillDate' },
      { label: 'Carrier', value: 'carrier', nonSortable: true },
      { label: 'Tracking number', value: 'trackingLink', nonSortable: true },
      { label: 'Prescriptions in package', value: 'prescriptions', nonSortable: true },
    ];

    const tableClass = classNames(
      'usa-table-borderless',
      'va-table-list',
      'rx-table',
      'rx-table-list',
      'rx-detail-history'
    );

    return (
      <SortableTable
          className={tableClass}
          currentSort={this.state.currentSort}
          data={data}
          fields={fields}
          onSort={() => {}}/>
    );
  }
}

OrderHistory.propTypes = {
  items: PropTypes.array.isRequired
};

export default OrderHistory;
