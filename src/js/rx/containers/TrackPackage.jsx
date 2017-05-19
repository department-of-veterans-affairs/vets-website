import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

import SortableTable from '../../common/components/SortableTable';
import { formatDate } from '../utils/helpers';
import TrackPackageLink from '../components/TrackPackageLink';

class TrackPackage extends React.Component {
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
        shipmentDate: formatDate(shippedDate),
        carrier: deliveryService.toUpperCase(),
        trackingLink: (<TrackPackageLink
            className="rx-history-tracking"
            external
            text={trackingNumber}
            url={trackingUrl}/>),
        prescriptions,
        shippedDate
      };
    });

    data.sort((a, b) => {
      const { value, order } = this.state.currentSort;

      if (value === 'fillDate') {
        const diff = moment(a.shippedDate).diff(moment(b.shippedDate));
        return order === 'DESC' ? -diff : diff;
      }

      return 0;
    });

    const fields = [
      { label: 'Shipment date', value: 'shipmentDate' },
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
      <div id="rx-track-package" className="va-tab-content">
        <p className="rx-tab-explainer">* Tracking information for each order expires 30 days after shipment.</p>
        <SortableTable
            className={tableClass}
            currentSort={this.state.currentSort}
            data={data}
            fields={fields}
            onSort={(value, order) => {
              this.setState({
                currentSort: { value, order }
              });
            }}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  return { items: rxState.prescriptions.currentItem.trackings };
};

export default connect(mapStateToProps, null)(TrackPackage);
