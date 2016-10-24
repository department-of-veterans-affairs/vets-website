import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';
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
    this.makeContactCard = this.makeContactCard.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeInfo = this.makeInfo.bind(this);
    this.makeOrderHistory = this.makeOrderHistory.bind(this);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
    this.scrollToOrderHistory = this.scrollToOrderHistory.bind(this);
  }

  componentDidMount() {
    scrollTo(0, 0);
    const requestedRxId = this.props.params.id;
    this.props.loadPrescription(requestedRxId);

    // If order history was requested, scroll to it immediately if it's for
    // the same prescription that was viewed previously. Any updates from newly
    // fetched data for that prescription can load in the background.
    const shouldScrollToOrderHistory =
      this.props.location.hash === '#rx-order-history' &&
      requestedRxId === _.get(this.props.prescription, 'rx.id');

    if (shouldScrollToOrderHistory) {
      this.scrollToOrderHistory();
    }
  }

  componentDidUpdate(prevProps) {
    // If order history was requested, scroll to it after data has been fetched
    // and the page has updated to a different prescription.
    const shouldScrollToOrderHistory =
      this.props.location.hash === '#rx-order-history' &&
      _.get(prevProps.prescription, 'rx.id') !==
      _.get(this.props.prescription, 'rx.id');

    if (shouldScrollToOrderHistory) {
      this.scrollToOrderHistory();
    }
  }

  makeContactCard() {
    const facilityName = _.get(this.props.prescription, [
      'rx',
      'attributes',
      'facilityName'
    ]);

    const phoneNumber = _.get(this.props.prescription, [
      'trackings',
      '0',
      'attributes',
      'rxInfoPhoneNumber'
    ]);

    return (
      <ContactCard
          facilityName={facilityName}
          phoneNumber={phoneNumber}/>
    );
  }

  makeHeader() {
    const prescriptionName = _.get(this.props.prescription, [
      'rx',
      'attributes',
      'prescriptionName'
    ]);

    return <h2 className="rx-heading">{prescriptionName}</h2>;
  }

  makeInfo() {
    const attrs = _.get(this.props.prescription, 'rx.attributes', {});
    const status = rxStatuses[attrs.refillStatus];
    const data = {
      'Prescription #': attrs.prescriptionNumber,

      Quantity: attrs.quantity,

      'Prescription status': (
        <button
            className="rx-trigger"
            onClick={() => this.openGlossaryModal(status)}
            type="button">
          {status}
        </button>
      ),

      'Last fill date': attrs.dispensedDate
        ? moment(attrs.dispensedDate).format('MMM D, YYYY')
        : 'Not available',

      'Expiration date': attrs.expirationDate
        ? moment(attrs.expirationDate).format('MMM D, YYYY')
        : 'Not available',

      Refills: `${attrs.refillRemaining} remaining`
    };

    let refillButton;

    if (attrs.isRefillable) {
      refillButton = (
        <SubmitRefill
            onSubmit={(e) => {
              e.preventDefault();
              this.props.openRefillModal(attrs);
            }}
            refillId={attrs.id}
            text="Refill Prescription"/>
      );
    }

    return (
      <div id="rx-info">
        <TableVerticalHeader
            className="usa-table-borderless rx-table"
            data={data}/>
        {refillButton}
      </div>
    );
  }

  makeOrderHistory() {
    const trackings = this.props.prescription.trackings;
    let orderHistoryTable;

    if (trackings && trackings.length) {
      orderHistoryTable = (
        <OrderHistory
            className="usa-table-borderless va-table-list rx-table rx-table-list"
            items={trackings}/>
      );
    }

    return (
      <ScrollElement
          id="rx-order-history"
          name="orderHistory">
        <h3 className="rx-heading va-h-ruled">Order History</h3>
        <p>* Tracking information for each order expires 30 days after shipment.</p>
        {orderHistoryTable}
      </ScrollElement>
    );
  }

  openGlossaryModal(term) {
    const content = glossary.filter((obj) => {
      return obj.term === term;
    });

    this.props.openGlossaryModal(content);
  }

  scrollToOrderHistory() {
    scroller.scrollTo('orderHistory', {
      duration: 500,
      delay: 0,
      smooth: true,
    });
  }

  render() {
    let header;
    let rxInfo;
    let contactCard;
    let orderHistory;

    if (this.props.prescription) {
      header = this.makeHeader();
      rxInfo = this.makeInfo();
      contactCard = this.makeContactCard();
      orderHistory = this.makeOrderHistory();
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
  return { prescription: state.prescriptions.currentItem };
};

const mapDispatchToProps = {
  loadPrescription,
  openGlossaryModal,
  openRefillModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
