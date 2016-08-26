import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


import { loadData } from '../actions/prescriptions.js';
import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';

class Detail extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadData(this.props.params.id));
  }

  render() {
    let header;
    let rxInfo;
    let contactCard;
    let orderHistory;
    const item = this.props.prescriptions.currentItem;

    if (item) {
      // Compose components from Rx data.
      if (item.rx) {
        const attrs = item.rx.attributes;
        const data = {
          Quantity: attrs.quantity,
          // 'Prescription status': attrs[''],
          'Prescription date': moment(
              attrs['refill-submit-date']
            ).format('D MMM YYYY'),
          'Expiration date': moment(
              attrs['expiration-date']
            ).format('D MMM YYYY'),
          'Prescription #': attrs['prescription-number'],
          Refills: (
            <span>
              {attrs['refill-remaining']} left
              &nbsp;&nbsp;&nbsp;<a>Refill prescription</a>
            </span>
          )
        };

        header = (
          <h2 className="rx-detail-header">
            {attrs['prescription-name']}
          </h2>
        );

        rxInfo = (
          <TableVerticalHeader
              className="usa-table-borderless rx-table rx-info"
              data={data}/>
        );
      }

      // Compose components from tracking data.
      if (item.trackings) {
        const currentPackage = item.trackings[0].attributes;
        const facilityName = currentPackage['facility-name'];
        const phoneNumber = currentPackage['rx-info-phone-number'];

        contactCard = (
          <ContactCard
              facilityName={facilityName}
              phoneNumber={phoneNumber}/>
        );

        orderHistory = (
          <OrderHistory
              className="usa-table-borderless rx-table"
              items={item.trackings}/>
        );
      }
    }

    return (
      <div id="rx-detail" className="rx-app row">
        <h1>Mail Order Prescriptions</h1>
        <BackLink text="Back to list"/>
        {header}
        {rxInfo}
        {contactCard}
        {orderHistory}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Detail);
