import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { loadPrescription } from '../actions/prescriptions.js';
import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';
import { glossary, rxStatuses } from '../config.js';
import SubmitRefill from '../components/SubmitRefill';
import { openGlossaryModal, openRefillModal } from '../actions/modal';

export class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentDidMount() {
    this.props.loadPrescription(this.props.params.id);
  }

  openGlossaryModal(term) {
    const content = glossary.filter((obj) => {
      return obj.term === term;
    });

    this.props.openGlossaryModal(content);
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
        const status = rxStatuses[attrs.refillStatus];
        const data = {
          Quantity: attrs.quantity,
          'Prescription status': (
            <button
                className="rx-trigger"
                onClick={() => this.openGlossaryModal(status)}
                type="button">
              {status}
            </button>
          ),
          'Last fill date': moment(
              attrs.dispensedDate
            ).format('MMM DD, YYYY'),
          'Expiration date': moment(
              attrs.expirationDate
            ).format('MMM DD, YYYY'),
          'Prescription #': attrs.prescriptionNumber,
          Refills: (
            <div>
              {attrs.refillRemaining} remaining
              <SubmitRefill
                  cssClass="rx-trigger"
                  mode="compact"
                  onSubmit={(e) => { e.preventDefault(); this.props.openRefillModal(attrs); }}
                  refillId={item.rx.id}
                  text="Refill Prescription"/>
            </div>
          )
        };

        header = (
          <h2 className="rx-heading">
            {attrs.prescriptionName}
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
        const facilityName = currentPackage.facilityName;
        const phoneNumber = currentPackage.rxInfoPhoneNumber;

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
        <h1>Prescription Refill</h1>
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

const mapDispatchToProps = {
  loadPrescription,
  openGlossaryModal,
  openRefillModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
