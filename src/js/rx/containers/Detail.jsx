import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import moment from 'moment';

import { openGlossaryModal, openRefillModal } from '../actions/modal';
import { loadPrescription } from '../actions/prescriptions';
import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';
import SubmitRefill from '../components/SubmitRefill';
import { glossary, rxStatuses } from '../config';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

export class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentDidMount() {
    scrollTo(0, 0);
    this.props.loadPrescription(this.props.params.id);
  }

  componentDidUpdate() {
    if (this.props.location.hash === '#rx-order-history') {
      scroller.scrollTo('orderHistory', {
        duration: 500,
        delay: 0,
        smooth: true,
      });
    }
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
    let orderHistorySection;
    let orderHistoryTable;
    let facilityName;
    let phoneNumber;

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

        // Get facility name for contact info.
        facilityName = attrs.facilityName;
      }

      // Compose components from tracking data.
      if (item.trackings && item.trackings.length > 0) {
        const currentPackage = item.trackings[0].attributes;

        // Get phone number for contact info.
        phoneNumber = currentPackage.rxInfoPhoneNumber;

        orderHistoryTable = (
          <OrderHistory
              className="usa-table-borderless rx-table rx-table-list"
              items={item.trackings}/>
        );
      }

      orderHistorySection = (
        <ScrollElement
            id="rx-order-history"
            name="orderHistory">
          <h3 className="rx-heading va-h-ruled">Order History</h3>
          <p>* Tracking information for each order expires 30 days after shipment.</p>
          {orderHistoryTable}
        </ScrollElement>
      );

      contactCard = (
        <ContactCard
            facilityName={facilityName}
            phoneNumber={phoneNumber}/>
      );
    }

    return (
      <div id="rx-detail" className="rx-app row">
        <h1>Prescription Refill</h1>
        <BackLink text="Back to list"/>
        {header}
        {rxInfo}
        {contactCard}
        {orderHistorySection}
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
