import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import AlertBox from '../../common/components/AlertBox';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { closeAlert } from '../actions/alert.js';
import { openGlossaryModal, openRefillModal } from '../actions/modals';
import { loadPrescription } from '../actions/prescriptions';
import ContactCard from '../components/ContactCard';
import GlossaryLink from '../components/GlossaryLink';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';
import SubmitRefill from '../components/SubmitRefill';
import { rxStatuses } from '../config';
import { formatDate } from '../utils/helpers';
import { getScrollOptions } from '../../common/utils/helpers';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

export class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.makeContactCard = this.makeContactCard.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeInfo = this.makeInfo.bind(this);
    this.makeOrderHistory = this.makeOrderHistory.bind(this);
    this.scrollToOrderHistory = this.scrollToOrderHistory.bind(this);
  }

  componentDidMount() {
    scrollTo(0, 0);

    if (!this.props.loading) {
      this.props.loadPrescription(this.props.params.id);
    }
  }

  componentDidUpdate() {
    // If order history was requested, scroll to it after data has been fetched
    // and the page has updated to a different prescription.
    const shouldScrollToOrderHistory =
      !this.props.loading &&
      this.props.location.hash === '#rx-order-history';

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

    return <h2>{prescriptionName}</h2>;
  }

  makeInfo() {
    const attrs = _.get(this.props.prescription, 'rx.attributes', {});
    const status = rxStatuses[attrs.refillStatus];

    const data = {
      'Prescription #': attrs.prescriptionNumber,

      Quantity: attrs.quantity,

      'Prescription status': status ? (
        <GlossaryLink
            term={status}
            onClick={this.props.openGlossaryModal}/>
      ) : null,

      'Last fill date': formatDate(
        attrs.refillDate,
        { validateInPast: true }
      ),

      'Expiration date': formatDate(attrs.expirationDate),

      Refills: `${attrs.refillRemaining} remaining`
    };

    let refillButton;

    if (attrs.isRefillable) {
      refillButton = (
        <SubmitRefill
            className="rx-prescription-button"
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
            className="usa-table-borderless va-table-list rx-table rx-table-list rx-detail-history"
            items={trackings}/>
      );
    }

    return (
      <ScrollElement
          id="rx-order-history"
          name="orderHistory">
        <h3>Order History</h3>
        <p>* Tracking information for each order expires 30 days after shipment.</p>
        {orderHistoryTable}
      </ScrollElement>
    );
  }

  scrollToOrderHistory() {
    scroller.scrollTo('orderHistory', getScrollOptions());
  }

  render() {
    const requestedRxId = this.props.params.id;
    const currentRxId = _.get(this.props.prescription, 'rx.id');
    const isSameRx = requestedRxId === currentRxId;
    let content;

    // If the item in state doesn't reflect the item from the URL,
    // show the loader until the requested item finishes loading.
    if (this.props.loading || (this.props.prescription && !isSameRx)) {
      content = <LoadingIndicator message="Loading your prescription..."/>;
    } else if (this.props.prescription) {
      const header = this.makeHeader();
      const rxInfo = this.makeInfo();
      const contactCard = this.makeContactCard();
      const orderHistory = this.makeOrderHistory();

      content = (
        <div>
          {header}
          <div className="row">
            <div className="columns usa-width-two-thirds medium-8">
              {rxInfo}
            </div>
            <div className="columns usa-width-one-third medium-4">
              {contactCard}
            </div>
          </div>
          <div className="row">
            <div className="columns usa-width-two-thirds medium-8">
              {orderHistory}
            </div>
          </div>
        </div>
      );
    } else {
      content = (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn't retrieve your prescription.
          Please refresh this page or try again later.
          If this problem persists, please call the Vets.gov Help Desk
          at 1-855-574-7286, Monday ‒ Friday, 8:00 a.m. ‒ 8:00 p.m. (ET).
        </p>
      );
    }

    return (
      <div>
        <AlertBox
            content={this.props.alert.content}
            isVisible={this.props.alert.visible}
            onCloseAlert={this.props.closeAlert}
            scrollOnShow
            status={this.props.alert.status}/>
        <div id="rx-detail">
          <h1>Prescription Refill</h1>
          {content}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  return {
    alert: rxState.alert,
    loading: rxState.prescriptions.detail.loading,
    prescription: rxState.prescriptions.currentItem
  };
};

const mapDispatchToProps = {
  closeAlert,
  loadPrescription,
  openGlossaryModal,
  openRefillModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
