import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { openGlossaryModal } from '../actions/modal.js';
import { loadPrescription } from '../actions/prescriptions.js';
import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';
import { glossary, rxStatuses } from '../config.js';

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadPrescription(this.props.params.id));
  }

  openGlossaryModal(term) {
    const content = glossary.filter((obj) => {
      return obj.term === term;
    });

    this.props.dispatch(openGlossaryModal(content));
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
        const status = rxStatuses[attrs['refill-status']];
        const data = {
          Quantity: attrs.quantity,
          'Prescription status': (
            <a onClick={() => this.openGlossaryModal(status)}>
              {status}
            </a>
          ),
          'Last fill date': moment(
              attrs['dispensed-date']
            ).format('MMM DD, YYYY'),
          'Expiration date': moment(
              attrs['expiration-date']
            ).format('MMM DD, YYYY'),
          'Prescription #': attrs['prescription-number'],
          Refills: (
            <span>
              {attrs['refill-remaining']} remaining
              <a className="rx-refill-link">Refill prescription</a>
            </span>
          )
        };

        header = (
          <h2 className="rx-heading">
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
          <div className="rx-order-history">
            <h3 className="rx-heading va-h-ruled">Order History</h3>
            <OrderHistory
                className="usa-table-borderless rx-table rx-table-list"
                items={item.trackings}/>
          </div>
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
