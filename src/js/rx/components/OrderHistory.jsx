import React from 'react';
import moment from 'moment';

import TrackPackageLink from './TrackPackageLink';

class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.makeRow = this.makeRow.bind(this);
  }

  makeRow(item) {
    const attrs = item.attributes;
    return (
      <tr key={item.id}>
        <td>
          Shipped on {moment(
            attrs.shippedDate
          ).format('MMM DD, YYYY')}
        </td>
        <td>
          <TrackPackageLink
              external
              text={attrs.trackingNumber}
              url={item.links.trackingUrl}/>
          &nbsp;({attrs.deliveryService.toUpperCase()})
        </td>
      </tr>
    );
  }

  render() {
    const rows = this.props.items.map(this.makeRow);

    return (
      <table className={this.props.className}>
        <thead>
          <tr>
            <th>Order status</th>
            <th>Tracking status</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

OrderHistory.propTypes = {
  className: React.PropTypes.string,
  items: React.PropTypes.array.isRequired
};

export default OrderHistory;
