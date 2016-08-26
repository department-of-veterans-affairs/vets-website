import React from 'react';

import moment from 'moment';

import TrackPackageLink from './TrackPackageLink';

class OrderHistory extends React.Component {
  makeRow(item) {
    const attrs = item.attributes;
    return (
      <tr>
        <td>
          Shipped on {moment(
            attrs['shipped-date']
          ).format('MMM D, YYYY')}
        </td>
        <td>
          <TrackPackageLink
              text={attrs['tracking-number']}/>
          &nbsp;({attrs['delivery-service']})
        </td>
      </tr>
    );
  }

  render() {
    const rows = this.props.items.map(this.makeRow);

    return (
      <div>
        <h3>Order History</h3>
        <table className={this.props.className}>
          <thead>
            <th>Order status</th>
            <th>Tracking status</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

OrderHistory.propTypes = {
  className: React.PropTypes.string,
  items: React.PropTypes.array.isRequired
};

export default OrderHistory;
